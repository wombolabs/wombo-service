import prisma from '~/services/prisma'
import R from 'ramda'

export const getOrderIdByBookingId = async (bookingId) => {
  const result = await prisma.$queryRaw`
    SELECT o.id FROM "Order" o WHERE metadata->>'uid' = ${bookingId}`
  return !R.isEmpty(result) ? result[0].id : null
}
