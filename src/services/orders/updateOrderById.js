import R from 'ramda'

import prisma from '~/services/prisma'

import { getOrderById } from './getOrderById'

export const updateOrderById = async (id, order) => {
  const newOrder = order

  if (!R.isEmpty(newOrder.metadata)) {
    const savedOrder = await getOrderById(id)
    newOrder.metadata = R.mergeDeepLeft(newOrder.metadata, savedOrder.metadata)
  }

  const result = await prisma.order.update({
    where: {
      id,
    },
    data: newOrder,
  })

  return result
}
