import R from 'ramda'
import prisma from '~/services/prisma'
import { ResourceNotFoundError } from '~/errors'
import { isNilOrEmpty } from '~/utils/isNilOrEmpty'
import { getStudentByEmail } from './getStudentByEmail'
import { listVideoGames } from '../videoGames'

const studentMetadataProperties = ['profile']

export const updateStudentByEmail = async (email, student = {}) => {
  const savedStudent = await getStudentByEmail(email)
  if (isNilOrEmpty(savedStudent)) {
    throw new ResourceNotFoundError(`Student not found with email ${email}.`)
  }

  const newStudent = student

  const updatedStudent = R.mergeLeft(R.omit(['metadata'], newStudent), R.omit(['metadata'], savedStudent))

  updatedStudent.metadata = {}
  delete updatedStudent.id
  delete updatedStudent.email
  delete updatedStudent.password // TODO implement change password for WP users

  const videoGames = await listVideoGames({ isActive: true })

  R.forEach((prop) => {
    updatedStudent.metadata[prop] = R.mergeDeepLeft(
      (newStudent.metadata && newStudent.metadata[prop]) ?? {},
      (savedStudent.metadata && savedStudent.metadata[prop]) ?? {},
    )
  })([...studentMetadataProperties, ...R.pluck('codename')(videoGames)])

  updatedStudent.metadata.videoGames = R.pipe(
    R.concat(newStudent.metadata?.videoGames ?? []),
    R.uniq,
  )(savedStudent.metadata?.videoGames ?? [])

  const result = await prisma.student.update({
    where: { email },
    data: updatedStudent,
  })

  return result
}
