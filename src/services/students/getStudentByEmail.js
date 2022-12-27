import prisma from '~/services/prisma'
import { ResourceNotFoundError, InsufficientDataError } from '~/errors'
import { notNilNorEmpty } from '~/utils/notNilNorEmpty'

export const getStudentByEmail = async (email, filters = {}) => {
  if (!email) {
    throw new InsufficientDataError('Email field is required.')
  }

  const { withCompetitions } = filters

  const include = {}
  if (withCompetitions) {
    include.competitions = true
  }

  const query = {
    where: {
      email,
      isActive: true,
    },
  }
  if (notNilNorEmpty(include)) {
    query.include = include
  }

  const result = await prisma.student.findFirst(query)

  if (!result) {
    throw new ResourceNotFoundError(`Student not found with email ${email}.`)
  }

  return result
}
