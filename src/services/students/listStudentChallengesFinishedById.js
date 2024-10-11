import { validate as uuidValidate } from 'uuid'

import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils/notNilNorEmpty'

import { CHALLENGE_STATUSES } from '../challenges/constants'

export const listStudentChallengesFinishedById = async (studentId, filters = {}) => {
  if (!uuidValidate(studentId)) {
    throw new InsufficientDataError('Invalid Student identification.')
  }

  const {
    cmsVideoGameHandleId, // list challenges from cmsVideoGameHandleId
    limit, // limit of challenges
  } = filters

  const where = {
    isActive: true,
    status: { in: [CHALLENGE_STATUSES.FINISHED] },
    OR: [{ ownerId: { equals: studentId } }, { challengerId: { equals: studentId } }],
    competitionId: { equals: null },
  }
  if (notNilNorEmpty(cmsVideoGameHandleId)) {
    where.cmsVideoGameHandleId = { equals: cmsVideoGameHandleId }
  }

  const query = {
    where,
    select: {
      owner: {
        select: {
          username: true,
          metadata: true,
        },
      },
      challenger: {
        select: {
          username: true,
          metadata: true,
        },
      },
      ownerScore: true,
      challengerScore: true,
      updatedAt: true,
    },
    orderBy: [
      {
        updatedAt: 'desc',
      },
    ],
  }
  if (notNilNorEmpty(limit) && !Number.isNaN(parseInt(limit, 10))) {
    query.take = +limit
  }

  const result = await prisma.challenge.findMany(query)

  return result ?? []
}
