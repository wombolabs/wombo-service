import stripe from '~/services/stripe'
import { buildHandler } from '~/utils'
import { stripe as stripeConfig } from '~/config'
import prisma from '~/services/prisma'
import * as Sentry from '@sentry/serverless'
import { addGuildMemberRole } from '~/services/discord'
import { getTier } from '~/services/tiers'
import { InsufficientDataError, MethodNotAllowedError, RequestError } from '~/errors'
import R from 'ramda'
import { getStudentById } from '~/services/students'

const handlePaymentSuccess = async ({ data }) => {
  const stripePayload = data?.object
  if (R.isEmpty(stripePayload)) {
    throw new InsufficientDataError('Stripe payload is missing.')
  }

  const {
    id: paymentIntentId,
    customer: customerId,
    invoice: invoiceId,
    charges,
    metadata,
    payment_method: paymentMethodId,
    livemode,
  } = stripePayload

  const stripeChargesData = charges?.data[0]
  if (R.isEmpty(stripeChargesData)) {
    throw new InsufficientDataError('Stripe charges data is missing.')
  }

  const { amount, currency, receipt_url: receiptUrl, refunded } = stripeChargesData
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
    validTill: new Date(), // TODO
    billingInterval: tier.billingInterval,
    billingAmount: amountDecimal,
    billingCurrency: currency,
    livemode,
  }

  await prisma.order.create({ data: order })

  if (customerId && invoiceId) {
    // SUBSCRIPTION
    const { discordRoleIds = [] } = tier
    if (R.isEmpty(discordRoleIds)) {
      throw new Error(`Tier discord role ids are missing for tier ${tierId}.`)
    }

    const { discord = {} } = await getStudentById(studentId, ['discord'])
    if (discord?.id == null || discord?.accessToken == null || !discord?.scope.includes('guilds.join')) {
      throw new InsufficientDataError(`Discord required fields are missing for student ${studentId}.`)
    }

    await Promise.all(discordRoleIds.map((roleId) => addGuildMemberRole(discord.id, roleId)))
  }
}

const webhookHandlers = {
  'payment_intent.succeeded': handlePaymentSuccess,
}

const webhookHandler = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      throw new MethodNotAllowedError()
    }
    const sig = req.headers['stripe-signature']
    if (!sig) {
      throw new InsufficientDataError('Missing stripe signature.')
    }
    if (!stripeConfig.webhookSecret) {
      throw new RequestError('Missing Stripe webhook secret.')
    }

    let event

    try {
      event = stripe.webhooks.constructEvent(req.rawBody, req.headers['stripe-signature'], stripeConfig.webhookSecret)
    } catch (error) {
      throw new RequestError('Stripe webhook signature verification failed.', 400, error)
    }

    console.log('stripe | type=', event?.type, 'payload=', JSON.stringify(event?.data?.object))

    const handler = webhookHandlers[event?.type]
    if (handler) {
      await handler(event)
    } else {
      /** Not really an error, just letting Stripe know that the webhook was received but unhandled */
      return res.status(202).json({ message: `Unhandled Stripe webhook event type ${event?.type}` })
    }

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

export const stripeWebhookHandler = buildHandler('/stripe/webhook', 'post', webhookHandler, {
  middlewares: [],
})
