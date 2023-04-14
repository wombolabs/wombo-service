import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'

export const enrollForChallenge = async (challengeId, studentId) => {
  if (!challengeId || !studentId) {
    throw new InsufficientDataError('Challenge ID and Student ID fields are required.')
  }

  const result = await prisma.challenge.update({
    where: {
      id: challengeId,
    },
    data: {
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
