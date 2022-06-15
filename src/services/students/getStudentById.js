import prisma from '~/services/prisma'
import { ResourceNotFoundError, InsufficientDataError } from '~/errors'
import { validate as uuidValidate } from 'uuid'

export const getStudentById = async (id) => {
  if (!uuidValidate(id)) {
    throw new InsufficientDataError()
  }

  const result = await prisma.student.findFirst({
    where: {
      id,
      isActive: true,
    },
  })

  if (!result) {
    throw new ResourceNotFoundError()
  }

  return result
}
