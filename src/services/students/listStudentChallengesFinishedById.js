import { validate as uuidValidate } from 'uuid'
import prisma from '~/services/prisma'
import { InsufficientDataError } from '~/errors'
import { CHALLENGE_STATUSES } from '../challenges/constants'

export const listStudentChallengesFinishedById = async (studentId) => {
  if (!uuidValidate(studentId)) {
    throw new InsufficientDataError('Invalid Student identification.')
  }

  const query = {
    where: {
      isActive: true,
      status: { in: [CHALLENGE_STATUSES.FINISHED] },
      OR: [{ ownerId: { equals: studentId } }, { challengerId: { equals: studentId } }],
      competitionId: { equals: null },
    },
    select: {
      owner: {
        select: {
          username: true,
          metadata: true,
          stat: {
            select: {
              rating: true,
            },
          },
        },
      },
      challenger: {
        select: {
          username: true,
          metadata: true,
          stat: {
            select: {
              rating: true,
            },
          },
        },
      },
      ownerScore: true,
      challengerScore: true,
      updatedAt: true,
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  }

  const result = await prisma.challenge.findMany(query)

  return result ?? []
}
