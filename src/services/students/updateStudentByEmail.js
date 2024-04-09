import R from 'ramda'
import prisma from '~/services/prisma'
import { ResourceNotFoundError } from '~/errors'
import { isNilOrEmpty } from '~/utils/isNilOrEmpty'
import { getStudentByEmail } from './getStudentByEmail'

const studentMetadataProperties = ['system', 'profile']

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

  R.forEach((prop) => {
    updatedStudent.metadata[prop] = R.mergeDeepLeft(
      newStudent?.metadata?.[prop] ?? {},
      savedStudent?.metadata?.[prop] ?? {},
    )
  })([...studentMetadataProperties])

  const result = await prisma.student.update({
    where: { email },
    data: updatedStudent,
  })

  return result
}
