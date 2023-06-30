import prisma from '~/services/prisma'
import { validate as uuidValidate } from 'uuid'
import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import R from 'ramda'

const processFields = R.reduce((acc, value) => {
  acc[value] = true
  return acc
}, {})

export const getTierById = async (id, selectFields = []) => {
  if (!uuidValidate(id)) {
    throw new InsufficientDataError('Invalid Tier identification.')
  }

  const query = {
    where: {
      id,
      isActive: true,
    },
  }

  if (!R.isEmpty(selectFields)) {
    query.select = processFields(selectFields)
  }

  const result = await prisma.tier.findFirst(query)

  if (!result) {
    throw new ResourceNotFoundError(`Tier not found with id ${id}.`)
  }

  return result
}
