import R from 'ramda'
import prisma from '~/services/prisma'
import { getStudentByEmail } from './getStudentByEmail'

export const updateStudentByEmail = async (email, student) => {
  const newStudent = student

  delete newStudent.email
  delete newStudent.password // TODO implement change password for WP users

  if (!R.isEmpty(newStudent.discord)) {
    const savedStudent = await getStudentByEmail(email)
    newStudent.discord = R.mergeDeepLeft(newStudent.discord, savedStudent.discord)
  }

  const result = await prisma.student.update({
    where: {
      email,
    },
    data: newStudent,
  })

  return result
}
