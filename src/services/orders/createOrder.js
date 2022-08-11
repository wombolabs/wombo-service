import prisma from '~/services/prisma'

export const createOrder = async (order) => {
  const result = await prisma.order.create({ data: order })
  return result
}
