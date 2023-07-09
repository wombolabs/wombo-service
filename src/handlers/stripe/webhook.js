import R from 'ramda'
import * as Sentry from '@sentry/serverless'
import stripe, { CHARGE_SUCCEEDED_TYPES, getStripeCustomerById } from '~/services/stripe'
import { buildHandler } from '~/utils'
import { stripe as stripeConfig, isOffline } from '~/config'
import { STUDENT_WALLET_TRANSACTION_TYPES, createStudentWallet, createWalletTransaction } from '~/services/students'
import { InsufficientDataError, MethodNotAllowedError, RequestError } from '~/errors'

const handleChargeSucceeded = async ({ data }) => {
  const stripePayload = data?.object
  if (R.isEmpty(stripePayload)) {
    throw new InsufficientDataError('Stripe payload is missing.')
  }

  const { payment_intent: paymentIntentId, customer: customerId, amount, metadata } = stripePayload
  let { studentId } = metadata
  const { paymentType } = metadata

  if (!CHARGE_SUCCEEDED_TYPES.includes(paymentType)) {
    const error = new Error('Handler charge.succeeded only for order type wallet.')
    error.statusCode = 202
    throw error
  }

  if (studentId == null) {
    const customer = await getStripeCustomerById(customerId)
    studentId = customer?.metadata?.userId
    if (studentId == null) {
      const error = new Error(`Student with email ${customer?.email} not found.`)
      error.statusCode = 202
      throw error
    }
  }

  const { id: walletId } = await createStudentWallet(studentId)

  await createWalletTransaction(
    walletId,
    amount / 100,
    STUDENT_WALLET_TRANSACTION_TYPES.DEPOSIT,
    `stripe paymentIntentId ${paymentIntentId}`
  )
}

const webhookHandlers = {
  'charge.succeeded': handleChargeSucceeded, // wallet
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

    if (isOffline) {
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
    if (isOffline) {
      console.error(error)
    }
    if (error.statusCode !== 202) {
      Sentry.captureException(error)
    }

    return res.status(error.statusCode ?? 500).json({ message: error?.message ?? 'Internal Error' })
  }
}

export const stripeWebhookHandler = buildHandler('/stripe/webhook', 'post', webhookHandler, {
  middlewares: [],
})
