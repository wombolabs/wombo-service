import R from 'ramda'
import { validate as uuidValidate } from 'uuid'

import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'

const processFields = R.reduce((acc, value) => {
  acc[value] = true
  return acc
}, {})

export const getStudentById = async (id, selectFields = []) => {
  if (!uuidValidate(id)) {
    throw new InsufficientDataError('Invalid Student identification.')
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

  const result = await prisma.student.findFirst(query)

  if (!result) {
    throw new ResourceNotFoundError(`Student not found with id ${id}.`)
  }

  return result
}
