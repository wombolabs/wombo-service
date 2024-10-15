import R from 'ramda'

import { DEFAULT_COUPON_FIELDS } from '~/services/coupons'

export const serializeCoupon = R.curry((extraFields, coupon) =>
  R.pick([...DEFAULT_COUPON_FIELDS, ...extraFields])(coupon),
)
