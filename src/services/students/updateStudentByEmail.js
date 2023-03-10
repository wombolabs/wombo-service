import R from 'ramda'
import { Prisma } from '@prisma/client'
import prisma from '~/services/prisma'
import { DuplicateResourceError, ResourceNotFoundError } from '~/errors'
import { getStudentByEmail } from './getStudentByEmail'

const studentMetadataProperties = ['profile', 'valorant', 'leagueOfLegends', 'mokensLeague']
const studentProperties = ['discord', 'stripe']

export const updateStudentByEmail = async (email, student = {}) => {
  const savedStudent = await getStudentByEmail(email)
  if (!savedStudent) {
    throw new ResourceNotFoundError(`Student not found with email ${email}.`)
  }

  const newStudent = student

  const updatedStudent = R.mergeLeft(
    R.omit(['metadata', ...studentProperties], newStudent),
    R.omit(['metadata', ...studentProperties], savedStudent)
  )

  updatedStudent.metadata = {}
  delete updatedStudent.id
  delete updatedStudent.email
  delete updatedStudent.password // TODO implement change password for WP users

  R.forEach((prop) => {
    updatedStudent[prop] = R.mergeDeepLeft(newStudent[prop] ?? {}, savedStudent[prop] ?? {})
  })(studentProperties)

  R.forEach((prop) => {
    updatedStudent.metadata[prop] = R.mergeDeepLeft(
      (newStudent.metadata && newStudent.metadata[prop]) ?? {},
      (savedStudent.metadata && savedStudent.metadata[prop]) ?? {}
    )
  })(studentMetadataProperties)

  updatedStudent.metadata.videoGames = R.pipe(
    R.concat(newStudent.metadata?.videoGames ?? []),
    R.uniq
  )(savedStudent.metadata?.videoGames ?? [])

  let result
  try {
    result = await prisma.student.update({
      where: {
        email,
      },
      data: updatedStudent,
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002' && error.meta?.target?.includes('username')) {
        throw new DuplicateResourceError('The username already exists.', null, error)
      }
    }
    throw error
  }

  return result
}
