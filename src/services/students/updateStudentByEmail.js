import R from 'ramda'
import prisma from '~/services/prisma'
import { getStudentByEmail } from './getStudentByEmail'

export const updateStudentByEmail = async (email, student) => {
  const savedStudent = await getStudentByEmail(email)

  const newStudent = student
  delete newStudent.email

  if (newStudent.discord) {
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
