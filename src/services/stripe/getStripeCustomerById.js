import stripe from './stripe'

export const getStripeCustomerById = async (id) => {
  const customer = await stripe.customers.retrieve(id)
  return customer
}
