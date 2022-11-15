import R from 'ramda'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils/notNilNorEmpty'
import { getStudentByEmail } from './getStudentByEmail'

export const updateStudentByEmail = async (email, student) => {
  const newStudent = student

  delete newStudent.email
  delete newStudent.password // TODO implement change password for WP users

  let savedStudent
  if (notNilNorEmpty(newStudent.discord)) {
    savedStudent = await getStudentByEmail(email)
    newStudent.discord = R.mergeDeepLeft(newStudent.discord, savedStudent.discord)
  }
  if (notNilNorEmpty(newStudent.metadata)) {
    if (!savedStudent) {
      savedStudent = await getStudentByEmail(email)
    }

    if (notNilNorEmpty(savedStudent.metadata?.videoGames) && notNilNorEmpty(newStudent.metadata?.videoGames)) {
      newStudent.metadata.videoGames = R.pipe(
        R.concat(newStudent.metadata.videoGames ?? []),
        R.uniq
      )(savedStudent.metadata.videoGames)
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
