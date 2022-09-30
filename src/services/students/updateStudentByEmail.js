import R from 'ramda'
import prisma from '~/services/prisma'
import { getStudentByEmail } from './getStudentByEmail'

export const updateStudentByEmail = async (email, student) => {
  const newStudent = student

  delete newStudent.email
  delete newStudent.password // TODO implement change password for WP users

  let savedStudent
  if (!R.isEmpty(newStudent.discord)) {
    savedStudent = await getStudentByEmail(email)
    newStudent.discord = R.mergeDeepLeft(newStudent.discord, savedStudent.discord)
  }
  if (!R.isEmpty(newStudent.metadata)) {
    if (!savedStudent) {
      savedStudent = await getStudentByEmail(email)
    }
    newStudent.metadata = R.mergeDeepLeft(newStudent.metadata, savedStudent.metadata)
  }

  const result = await prisma.student.update({
    where: {
      email,
    },
    data: newStudent,
  })

  return result
}
