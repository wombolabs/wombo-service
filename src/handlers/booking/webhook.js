import { buildHandler } from '~/utils'
import * as Sentry from '@sentry/serverless'
import { InsufficientDataError } from '~/errors'
import { getStudentByEmail } from '~/services/students'
import { getCoachByEmail } from '~/services/coaches'
import moment from 'moment-timezone'
import { createOrder, getOrderIdByBookingId, updateOrderById } from '~/services/orders'

const handleBookingCreated = async ({
  organizer,
  attendees,
  startTime,
  endTime,
  metadata,
  uid,
  location,
  title,
  description,
}) => {
  const { email: coachEmail, timeZone: coachTimeZone } = organizer
  const { email: studentEmail, timeZone: studentTimeZone } = attendees[0]

  const student = await getStudentByEmail(studentEmail)
  const coach = await getCoachByEmail(coachEmail)

  const order = {
    type: 'one_time',
    student: {
      connect: { id: student.id },
    },
    coachId: coach.id,
    validFrom: moment.tz(startTime, studentTimeZone).utc().toDate(),
    validTill: moment.tz(endTime, studentTimeZone).utc().toDate(),
    billingAmount: metadata.price ?? 0,
    billingCurrency: metadata.currency ?? 'usd',
    metadata: {
      uid,
      location,
      coachTimeZone,
      studentTimeZone,
      title,
      description,
    },
  }

  await createOrder(order)
}

const handleBookingRescheduled = async ({ uid, rescheduleUid, startTime, endTime, attendees }) => {
  const orderId = await getOrderIdByBookingId(rescheduleUid)

  const { timeZone: studentTimeZone } = attendees[0]

  const order = {
    validFrom: moment.tz(startTime, studentTimeZone).utc().toDate(),
    validTill: moment.tz(endTime, studentTimeZone).utc().toDate(),
    metadata: {
      uid,
      rescheduleUid,
    },
  }

  await updateOrderById(orderId, order)
}

const handleBookingCancelled = async ({ uid, cancellationReason }) => {
  const orderId = await getOrderIdByBookingId(uid)

  const order = {
    isCancelled: true,
    cancellationReason,
  }

  await updateOrderById(orderId, order)
}

const webhookHandlers = {
  BOOKING_CREATED: handleBookingCreated,
  BOOKING_RESCHEDULED: handleBookingRescheduled,
  BOOKING_CANCELLED: handleBookingCancelled,
}

const webhookHandler = async ({ body }, res) => {
  try {
    const { triggerEvent, payload } = body

    const handler = webhookHandlers[triggerEvent]
    if (!handler) {
      throw new InsufficientDataError(`Unhandled Booking webhook event type ${triggerEvent}.`)
    }

    await handler(payload)

    // Return a response to acknowledge receipt of the event
    return res.json({ received: true })
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error)
    }
    Sentry.captureException(error)

    return res.status(error.statusCode ?? 500).json({ message: error.message })
  }
}

export const bookingWebhookHandler = buildHandler('/booking/webhook', 'post', webhookHandler)
