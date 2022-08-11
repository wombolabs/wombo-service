import { ResourceNotFoundError } from '~/errors'
import { createStudent } from './createStudent'
import { getStudentByEmail } from './getStudentByEmail'
import { updateStudentByEmail } from './updateStudentByEmail'

export const upsertStudent = async (student) => {
  let savedStudent

  try {
    savedStudent = await getStudentByEmail(student.email)
  } catch (error) {
    if (!(error instanceof ResourceNotFoundError)) {
      throw error
    }
  }

  if (!savedStudent) {
    savedStudent = await createStudent(student)
  } else {
    savedStudent = await updateStudentByEmail(student.email, student)
  }

  return savedStudent
}
