import prisma from '~/services/prisma'
import { ResourceNotFoundError, InsufficientDataError } from '~/errors'

export const getStudentByEmail = async (email) => {
  if (!email) {
    throw new InsufficientDataError('Email field is required.')
  }

  const result = await prisma.student.findFirst({
    where: {
      email,
      isActive: true,
    },
  })

  if (!result) {
    throw new ResourceNotFoundError()
  }

  return result
}
