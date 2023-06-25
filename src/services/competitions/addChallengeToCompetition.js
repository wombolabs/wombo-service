import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'

export const addChallengeToCompetition = async (codename, challengeId) => {
  if (!codename || !challengeId) {
    throw new InsufficientDataError('Codename and Challenge ID fields are required.')
  }

  const result = await prisma.competition.update({
    where: {
      codename,
    },
    data: {
      challenges: {
        connect: [{ id: challengeId }],
      },
    },
  })

  if (!result) {
    throw new ResourceNotFoundError(`Competition not found with codename ${codename}.`)
  }

  return result
}
