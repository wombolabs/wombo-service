import { ResourceNotFoundError } from '~/errors'
import { isNilOrEmpty } from '~/utils/isNilOrEmpty'
import { notNilNorEmpty } from '~/utils/notNilNorEmpty'

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

  if (isNilOrEmpty(savedStudent)) {
    savedStudent = await createStudent(student)
  } else {
    if (notNilNorEmpty(savedStudent?.username)) {
      // eslint-disable-next-line no-param-reassign
      delete student?.username
    }
    savedStudent = await updateStudentByEmail(student?.email, student)
  }

  return savedStudent
}
