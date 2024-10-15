import { validate as uuidValidate } from 'uuid'

import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'

export const getOrderById = async (id) => {
  if (!uuidValidate(id)) {
    throw new InsufficientDataError('Invalid Order identification.')
  }

  const query = {
    where: {
      id,
      isActive: true,
    },
  }

  const result = await prisma.order.findFirst(query)

  if (!result) {
    throw new ResourceNotFoundError(`Order not found with id ${id}.`)
  }

  return result
}
