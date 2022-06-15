import Stripe from 'stripe'
import { stripe as stripeConfig } from '~/config'

// eslint-disable-next-line import/no-mutable-exports
let stripe

if (stripe == null) {
  stripe = new Stripe(stripeConfig.secretKey, {
    apiVersion: '2020-08-27',
  })
}

export default stripe
