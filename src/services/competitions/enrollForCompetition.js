import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'

export const enrollForCompetition = async (codename, studentId) => {
  if (!codename || !studentId) {
    throw new InsufficientDataError('Codename and Student ID fields are required.')
  }

  const result = await prisma.competition.update({
    where: {
      codename,
    },
    data: {
      participants: {
        connect: [{ id: studentId }],
      },
    },
  })

  if (!result) {
    throw new ResourceNotFoundError(`Competition not found with codename ${codename}.`)
  }

  return result
}
