import prisma from '~/services/prisma'
import { InsufficientDataError } from '~/errors'

const SELECTED_FIELDS = {
  id: true,
  videoGame: true,
  type: true,
  ranking: true,
  server: true,
  betAmount: true,
  fee: true,
  createdAt: true,
}

export const getStudentChallenges = async (email) => {
  if (!email) {
    throw new InsufficientDataError('Email field is required.')
  }

  const result = await prisma.student.findFirst({
    where: {
      email,
      isActive: true,
    },
    select: {
      challengesOwner: {
        select: {
          ...SELECTED_FIELDS,
          challenger: { select: { username: true, metadata: true } },
        },
      },
      challengesChallenger: {
        select: {
          ...SELECTED_FIELDS,
          owner: { select: { username: true, metadata: true, } },
        },
      },
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  })

  return result
}
