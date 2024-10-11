import { validate as uuidValidate } from 'uuid'

import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'

export const updateCompetitionById = async (id, competitionData) => {
  if (!uuidValidate(id)) {
    throw new InsufficientDataError('Invalid Competition identification.')
  }

  const result = await prisma.competition.update({ where: { id }, data: competitionData })

  if (!result) {
    throw new ResourceNotFoundError(`Competition not found with id ${id}.`)
  }

  return result
}
