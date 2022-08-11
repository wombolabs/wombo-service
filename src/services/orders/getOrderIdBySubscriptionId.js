import prisma from '~/services/prisma'
import R from 'ramda'

export const getOrderIdBySubscriptionId = async (subscriptionId) => {
  const result = await prisma.$queryRaw`
    SELECT o.id FROM "Order" o WHERE stripe->>'subscriptionId' = ${subscriptionId}`
  return !R.isEmpty(result) ? result[0].id : null
}
