import R from 'ramda'
import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'

export const createChallenge = async (studentId, challengeData = {}) => {
  if (!studentId || R.isEmpty(challengeData)) {
    throw new InsufficientDataError('Student ID and challenge data are required.')
  }

  const result = await prisma.challenge.create({
    data: {
      ...challengeData,
      owner: {
        connect: { id: studentId },
      },
    },
  })

  return result
}
