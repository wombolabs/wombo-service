import { ResourceNotFoundError } from '~/errors'
import stripe from '~/services/stripe'

export const getStripeSubscriptionById = async (id) => {
  let subscription
  try {
    subscription = await stripe.subscriptions.retrieve(id)
  } catch (err) {
    throw new ResourceNotFoundError(`Stripe Subscription not found with id ${id}.`, 404, err)
  }
  return subscription
}
