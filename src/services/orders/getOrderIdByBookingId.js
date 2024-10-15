import R from 'ramda'

import prisma from '~/services/prisma'

export const getOrderIdByBookingId = async (bookingId) => {
  const result = await prisma.$queryRaw`
    SELECT o.id FROM "Order" o WHERE metadata->>'uid' = ${bookingId}`
  return !R.isEmpty(result) ? result[0].id : null
}
