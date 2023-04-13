import stripe, { getStripeCustomerById, getStripeSubscriptionById } from '~/services/stripe'
import { buildHandler } from '~/utils'
import { stripe as stripeConfig, discord as discordConfig } from '~/config'
import prisma from '~/services/prisma'
import * as Sentry from '@sentry/serverless'
import { addGuildMemberRole, removeGuildMemberRole } from '~/services/discord'
import { getTierById } from '~/services/tiers'
import { InsufficientDataError, MethodNotAllowedError, RequestError } from '~/errors'
import R from 'ramda'
import { getStudentById } from '~/services/students'
import { getOrderIdBySubscriptionId } from '~/services/orders/getOrderIdBySubscriptionId'
import { createUserDM } from '~/services/discord/createUserDM'
import { createChannelMessage } from '~/services/discord/createChannelMessage'

const handleChargeSucceeded = async ({ data }) => {
  const stripePayload = data?.object
  if (R.isEmpty(stripePayload)) {
    throw new InsufficientDataError('Stripe payload is missing.')
  }

  const {
    id: chargeId,
    payment_intent: paymentIntentId,
    customer: customerId,
    amount,
    currency,
    metadata,
    payment_method: paymentMethodId,
    receipt_url: receiptUrl,
    livemode,
  } = stripePayload

  let { studentId } = metadata
  const { paymentType, coachId, competitionId, challengeId } = metadata

  if (!['donation', 'competition', 'challenge'].includes(paymentType)) {
    const error = new Error('Handler charge.succeeded only for order type donation, competition or challenge.')
    error.statusCode = 202
    throw error
  }

  if (studentId == null) {
    const customer = await getStripeCustomerById(customerId)
    if (customer?.metadata?.userId) {
      studentId = customer?.metadata?.userId
    } else {
      const error = new Error(`Student with email ${customer?.email} not found.`)
      error.statusCode = 202
      throw error
    }
  }

  const amountDecimal = amount / 100

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
            chargeId,
            paymentMethodId,
            receiptUrl,
          },
          amount: amountDecimal,
          currency,
          livemode,
        },
      ],
    },
    stripe: {
      paymentIntentId,
    },
    coachId,
    competitionId,
    challengeId,
    billingAmount: amountDecimal,
    billingCurrency: currency,
    livemode,
    status: 'paid',
  }

  await prisma.order.create({ data: order })
}

const handleInvoicePaymentSucceeded = async ({ data }) => {
  const stripePayload = data?.object
  if (R.isEmpty(stripePayload)) {
    throw new InsufficientDataError('Stripe payload is missing.')
  }

  const {
    id: invoiceId,
    payment_intent: paymentIntentId,
    customer: customerId,
    subscription: subscriptionId,
    amount_paid: amount,
    billing_reason: billingReason,
    currency,
    hosted_invoice_url: invoiceUrl,
    livemode,
  } = stripePayload

  const subscription = await getStripeSubscriptionById(subscriptionId)

  const { current_period_start: validFrom, current_period_end: validTill, status } = subscription
  let { studentId } = subscription.metadata
  const { coachId, tierId, paymentType } = subscription.metadata

  if (studentId == null) {
    const customer = await getStripeCustomerById(customerId)
    if (customer?.metadata?.userId) {
      studentId = customer?.metadata?.userId
    } else {
      const error = new Error(`Student with stripe customer email ${customer?.email} not found.`)
      error.statusCode = 202
      throw error
    }
  }

  const amountDecimal = amount / 100

  let tier = {}
  if (tierId) {
    tier = await getTierById(tierId, ['billingInterval', 'discordRoleIds'])
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
            invoiceId,
            paymentIntentId,
            subscriptionId,
            customerId,
            invoiceUrl,
            billingReason,
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
      billingReason,
    },
    coachId,
    tierId,
    validFrom: new Date(validFrom * 1000),
    validTill: new Date(validTill * 1000),
    billingInterval: tier?.billingInterval,
    billingAmount: amountDecimal,
    billingCurrency: currency,
    status,
    livemode,
  }

  await prisma.order.create({ data: order })

  // TODO update Stripe Subscription metadata with orderId

  if (customerId && invoiceId && billingReason === 'subscription_create') {
    // SUBSCRIPTION
    const { discord = {} } = await getStudentById(studentId, ['discord'])
    if (discord?.id != null && discord?.accessToken != null && discord?.scope.includes('guilds.join')) {
      // send DM to user
      const response = await createUserDM(discord.id)
      await createChannelMessage(response.id, discordConfig.messageSubscriptionCreated)

      const { discordRoleIds = [] } = tier
      if (!R.isEmpty(discordRoleIds)) {
        // add roles on Discord server
        await Promise.all(discordRoleIds.map((roleId) => addGuildMemberRole(discord.id, roleId)))
      }
    }
  }
}

const handleSubscriptionDeleted = async ({ data }) => {
  const stripePayload = data?.object
  if (R.isEmpty(stripePayload)) {
    throw new InsufficientDataError('Stripe payload is missing.')
  }

  const { id: subscriptionId, metadata } = stripePayload
  const { tierId, studentId } = metadata

  const [orderId, tier] = await Promise.all([
    getOrderIdBySubscriptionId(subscriptionId),
    getTierById(tierId, ['discordRoleIds']),
  ])

  await prisma.order.update({ where: { id: orderId }, data: { status: 'canceled' } })

  const { discordRoleIds = [] } = tier
  if (R.isEmpty(discordRoleIds)) {
    throw new Error(`Tier discord role ids are missing for tier ${tierId}. Student ${studentId}.`)
  }

  const { discord = {} } = await getStudentById(studentId, ['discord'])
  if (discord?.id == null || discord?.accessToken == null || !discord?.scope.includes('guilds.join')) {
    throw new InsufficientDataError(`Discord required fields are missing for student ${studentId}.`)
  }

  await Promise.all(discordRoleIds.map((roleId) => removeGuildMemberRole(discord.id, roleId)))

  // send DM to user
  const response = await createUserDM(discord.id.id)
  await createChannelMessage(response.id, discordConfig.messageSubscriptionCancelled)
}

const handleSubscriptionUpdated = async ({ data }) => {
  const stripePayload = data?.object
  if (R.isEmpty(stripePayload)) {
    throw new InsufficientDataError('Stripe payload is missing.')
  }

  const { id: subscriptionId, cancel_at_period_end: cancelAtPeriodEnd } = stripePayload

  const orderId = await getOrderIdBySubscriptionId(subscriptionId)
  if (!orderId) {
    const error = new Error('Handler customer.subscription.updated only for subscription cancellation.')
    error.statusCode = 202
    throw error
  }

  await prisma.order.update({ where: { id: orderId }, data: { cancelAtPeriodEnd } })
}

const handleSubscriptionTrialEnd = async ({ data }) => {
  const stripePayload = data?.object
  if (R.isEmpty(stripePayload)) {
    throw new InsufficientDataError('Stripe payload is missing.')
  }

  const { studentId } = stripePayload.metadata

  const { discord = {} } = await getStudentById(studentId, ['discord'])
  if (discord?.id == null || discord?.accessToken == null || !discord?.scope.includes('guilds.join')) {
    throw new InsufficientDataError(`Discord required fields are missing for student ${studentId}.`)
  }

  // send DM to user
  const response = await createUserDM(discord.id)
  await createChannelMessage(response.id, discordConfig.messageSubscriptionCreated)
}

const webhookHandlers = {
  'charge.succeeded': handleChargeSucceeded, // donation | competition | challenge
  'invoice.payment_succeeded': handleInvoicePaymentSucceeded, // subscription created
  'customer.subscription.deleted': handleSubscriptionDeleted, // subscription cancelled
  'charge.failed': () => null,
  'invoice.payment_failed': () => null,
  'customer.subscription.updated': handleSubscriptionUpdated, // subscription updated
  'customer.subscription.trial_will_end': handleSubscriptionTrialEnd, // subscription trial end
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

    if (process.env.NODE_ENV !== 'production') {
      console.log('stripe | type=', event?.type, 'payload=', JSON.stringify(event?.data?.object))
    }

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

    return res.status(error.statusCode ?? 500).json({ message: error?.message ?? 'Internal Error' })
  }
}

export const stripeWebhookHandler = buildHandler('/stripe/webhook', 'post', webhookHandler, {
  middlewares: [],
})
