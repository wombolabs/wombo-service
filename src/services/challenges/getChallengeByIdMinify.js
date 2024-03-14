import prisma from '~/services/prisma'
import { ResourceNotFoundError, InsufficientDataError } from '~/errors'
import { validate as uuidValidate } from 'uuid'

export const getChallengeByIdMinify = async (id, filters) => {
  if (!uuidValidate(id)) {
    throw new InsufficientDataError('Invalid Challenge identification.')
  }

  const { isActive } = filters

  const query = {
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
        },
      },
      challenger: {
        select: {
          id: true,
        },
      },
      competition: { select: { id: true } },
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
