import prisma from '~/services/prisma'
import { ResourceNotFoundError, InsufficientDataError } from '~/errors'
import { notNilNorEmpty } from '~/utils/notNilNorEmpty'

export const getStudentByUsername = async (username, filters = {}) => {
  if (!username) {
    throw new InsufficientDataError('Username field is required.')
  }

  const { withWallet } = filters

  const include = {}
  if (withWallet) {
    include.wallet = true
  }

  const query = { where: { username: { equals: username, mode: 'insensitive' }, isActive: true } }
  if (notNilNorEmpty(include)) {
    query.include = include
  }

  const result = await prisma.student.findFirst(query)

  if (!result) {
    throw new ResourceNotFoundError(`Student not found with username ${username}.`)
  }

  return result
}
