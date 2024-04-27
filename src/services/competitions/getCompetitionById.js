import { validate as uuidValidate } from 'uuid'
import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'

export const getCompetitionById = async (id) => {
  if (!uuidValidate(id)) {
    throw new InsufficientDataError('Invalid Challenge identification.')
  }

  const query = { where: { id } }

  const result = await prisma.competition.findFirst(query)

  if (!result) {
    throw new ResourceNotFoundError(`Competition not found with ID ${id}.`)
  }

  return result
}
