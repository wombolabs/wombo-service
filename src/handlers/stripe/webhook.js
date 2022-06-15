import stripe from '~/services/stripe'
import { buildHandler } from '~/utils'
import { stripe as stripeConfig } from '~/config'
import prisma from '~/services/prisma'
import * as Sentry from '@sentry/serverless'
import { addGuildMemberRole } from '~/services/discord'
import { getTier } from '~/services/tiers'

const getStudentDiscordData = async (studentId) => {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      discord: true,
    },
  })
  if (student == null) {
    throw new Error('Student not found.')
  }
  const { discord: { id, accessToken } = {} } = student
  if (id == null || accessToken == null) {
    throw new Error('Discord fields are missing.')
  }
  return { id, accessToken }
}

const handlePaymentSuccess = async (event) => {
  try {
    const {
      id: paymentIntentId,
      customer: customerId,
      invoice: invoiceId,
      charges,
      metadata,
      payment_method: paymentMethodId,
      livemode,
    } = event?.data?.object
    const { amount, currency, receipt_url: receiptUrl, refunded } = charges?.data[0]
    const { subscriptionId, studentId, coachId, tierId, paymentType } = metadata

    const amountDecimal = amount / 100
    let tier = {}

    if (tierId) {
      tier = await getTier(tierId)
    }

    const order = {
      student: {
        connect: { id: studentId },
      },
      type: paymentType,
      payments: {
        create: [
          {
            method: 'stripe',
            stripe: {
              paymentIntentId,
              subscriptionId,
              customerId,
              invoiceId,
              paymentMethodId,
              receiptUrl,
              refunded,
            },
            amount: amountDecimal,
            currency,
            livemode,
          },
        ],
      },
      stripe: {
        subscriptionId,
        paymentIntentId,
      },
      coachId,
      tierId,
      validFrom: new Date(),
      validTill: new Date(),
      billingInterval: tier.billingInterval,
      billingAmount: amountDecimal,
      billingCurrency: currency,
      livemode,
    }

    await prisma.order.create({ data: order })

    if (customerId && invoiceId) {
      // SUBSCRIPTION
      const studentDiscordData = await getStudentDiscordData(studentId)

      const { discordRoleIds } = tier
      if (discordRoleIds == null || discordRoleIds.length === 0) {
        throw new Error('Tier discord role ids are missing.')
      }
      await Promise.all(discordRoleIds.map((rid) => addGuildMemberRole(studentDiscordData.id, rid)))
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error)
    }
    Sentry.captureException(error)
  }
}

const webhookHandlers = {
  'payment_intent.succeeded': handlePaymentSuccess,
}

const webhookHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }
  const sig = req.headers['stripe-signature']
  if (!sig) {
    return res.status(400).json({ message: 'Missing stripe-signature' })
  }
  if (!stripeConfig.webhookSecret) {
    return res.status(500).json({ message: 'Missing Stripe webhook secret' })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, req.headers['stripe-signature'], stripeConfig.webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed.')
    return res.sendStatus(400)
  }

  console.debug(event?.type)
  console.debug(JSON.stringify(event?.data?.object))
  /*   const event = {
    data: {
      object: req.body,
    },
  }; */

  const handler = webhookHandlers[event?.type]
  if (handler) {
    await handler(event)
  } else {
    /** Not really an error, just letting Stripe know that the webhook was received but unhandled */
    return res.status(202).json({ message: `Unhandled Stripe Webhook event type ${event?.type}` })
  }

  // Return a response to acknowledge receipt of the event
  return res.json({ received: true })
}

export const stripeWebhookHandler = buildHandler('/stripe/webhook', 'post', webhookHandler, {
  middlewares: [],
})

/*
# Donate
> Load /checkout/donate
payment_intent.created
> Pay
payment_intent.succeeded
charge.succeeded

# Subscription
> Load /checkout/donation
payment_intent.created
customer.updated
invoice.created
invoice.finalized
customer.subscription.created
> Pay
charge.succeeded
payment_method.attached
invoice.updated
customer.subscription.updated
invoice.paid
invoice.payment_succeeded
payment_intent.succeeded
*/
