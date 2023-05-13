import prisma from '~/services/prisma'
import { ResourceNotFoundError, InsufficientDataError } from '~/errors'
import { validate as uuidValidate } from 'uuid'

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
