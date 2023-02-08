import R from 'ramda'
import prisma from '~/services/prisma'
import { getStudentByEmail } from './getStudentByEmail'

const metadataProperties = ['profile', 'valorant', 'leagueOfLegends', 'mokensLeague']

export const updateStudentByEmail = async (email, student) => {
  const newStudent = student

  delete newStudent.email
  delete newStudent.password // TODO implement change password for WP users

  const savedStudent = await getStudentByEmail(email)

  if (newStudent.discord != null) {
    newStudent.discord = R.mergeDeepLeft(newStudent.discord, savedStudent.discord ?? {})
  }

  if (newStudent.metadata != null) {
    R.forEach((prop) => {
      if (newStudent.metadata[prop] != null) {
        newStudent.metadata[prop] = R.mergeDeepLeft(newStudent.metadata[prop], savedStudent.metadata[prop] ?? {})
      }
    })(metadataProperties)

    if (newStudent.metadata?.videoGames != null) {
      newStudent.metadata.videoGames = R.pipe(
        R.concat(newStudent.metadata.videoGames ?? []),
        R.uniq
      )(savedStudent.metadata.videoGames ?? [])
    }
  }

  const result = await prisma.student.update({
    where: {
      email,
    },
    data: newStudent,
  })

  return result
}
