import prisma from '~/services/prisma'
import { ResourceNotFoundError, InsufficientDataError } from '~/errors'
import { validate as uuidValidate } from 'uuid'
import R from 'ramda'

const processFields = R.reduce((acc, value) => { acc[value] = true; return acc }, {});

export const getStudentById = async (id, selectFields = []) => {
  if (!uuidValidate(id)) {
    throw new InsufficientDataError('Invalid UUID.')
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
    throw new ResourceNotFoundError()
  }

  return result
}
