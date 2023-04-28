import prisma from '~/services/prisma'
import { ResourceNotFoundError, InsufficientDataError } from '~/errors'
import { validate as uuidValidate } from 'uuid'

export const getChallengeById = async (id, filters) => {
  if (!uuidValidate(id)) {
    throw new InsufficientDataError('Invalid UUID.')
  }

  const { isActive } = filters

  const query = {
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          metadata: true,
        },
      },
      challenger: {
        select: {
          id: true,
          username: true,
          metadata: true,
        },
      },
    },
  }

  if (typeof isActive === 'boolean') {
    query.where.isActive = isActive
  }

  const result = await prisma.challenge.findFirst(query)

  if (!result) {
    throw new ResourceNotFoundError(`Challenge not found with id ${id}.`)
  }

  return result
}
