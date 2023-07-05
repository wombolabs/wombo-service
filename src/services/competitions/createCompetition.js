import prisma from '~/services/prisma'

export const createCompetition = async (competitionData = {}) => {
  const result = await prisma.competition.create({ data: competitionData })
  return result
}
