import { validate as uuidValidate } from 'uuid'

import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'

export const getChallengeById = async (id, filters) => {
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
          username: true,
          metadata: true,
          stats: {
            select: {
              rating: true,
              cmsVideoGameHandleId: true,
            },
          },
        },
      },
      challenger: {
        select: {
          id: true,
          username: true,
          metadata: true,
          stats: {
            select: {
              rating: true,
              cmsVideoGameHandleId: true,
            },
          },
        },
      },
      group: { select: { id: true, name: true } },
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
