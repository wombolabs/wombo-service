import { serializeCoupon } from '~/serializers'
import { getCouponByName } from '~/services/coupons'
import { buildHandler } from '~/utils'

const handler = async ({ params: { name }, query: { extraFields = [] } }, res) => {
  const result = await getCouponByName(name)
  return res.json(serializeCoupon(extraFields)(result))
}

export const getCouponHandler = buildHandler('/coupons/:name', 'get', handler)
