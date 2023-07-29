import prisma from '~/services/prisma'
import { ResourceNotFoundError, InsufficientDataError } from '~/errors'
import { isNilOrEmpty } from '~/utils/isNilOrEmpty'

export const getStudentByUsername = async (username) => {
  if (isNilOrEmpty(username)) {
    throw new InsufficientDataError('Username field is required.')
  }

  const query = { where: { username: { equals: username, mode: 'insensitive' }, isActive: true } }

  const result = await prisma.student.findFirst(query)

  if (!result) {
    throw new ResourceNotFoundError(`Student not found with username ${username}.`)
  }

  return result
}
