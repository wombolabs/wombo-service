import { validate as uuidValidate } from 'uuid'

import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'

export const getVideoGameById = async (id) => {
  if (!uuidValidate(id)) {
    throw new InsufficientDataError('Invalid VideoGame identification.')
  }

  const result = await prisma.videoGame.findFirst({
    where: {
      id,
      isActive: true,
    },
  })

  if (!result) {
    throw new ResourceNotFoundError(`VideoGame not found with id ${id}.`)
  }

  return result
}
