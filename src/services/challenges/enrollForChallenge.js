import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'
import { CHALLENGE_STATUSES } from './constants'

export const enrollForChallenge = async (challengeId, studentId) => {
  if (!challengeId || !studentId) {
    throw new InsufficientDataError('Challenge ID and Student ID fields are required.')
  }

  const result = await prisma.challenge.update({
    where: {
      id: challengeId,
    },
    data: {
      status: CHALLENGE_STATUSES.IN_PROGRESS,
      challenger: {
        connect: { id: studentId },
      },
    },
  })

  if (!result) {
    throw new ResourceNotFoundError(`Challenge not found with ID ${challengeId}.`)
  }

  return result
}
