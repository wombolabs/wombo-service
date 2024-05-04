import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

export const enrollForCompetition = async (codename, studentId, competitionData) => {
  if (!codename || !studentId) {
    throw new InsufficientDataError('Codename and Student ID fields are required.')
  }

  const data = {
    participants: {
      connect: [{ id: studentId }],
    },
  }

  if (notNilNorEmpty(competitionData?.predictions)) {
    const prediction = await prisma.prediction.create({
      data: {
        ownerId: studentId,
        metadata: { predictions: competitionData.predictions },
      },
    })
    data.predictions = {
      connect: [{ id: prediction.id }],
    }
  }

  const result = await prisma.competition.update({ where: { codename }, data })

  if (!result) {
    throw new ResourceNotFoundError(`Competition not found with codename ${codename}.`)
  }

  return result
}
