import R from 'ramda'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils/notNilNorEmpty'
import { getStudentByEmail } from './getStudentByEmail'

export const updateStudentByEmail = async (email, student) => {
  const newStudent = student

  delete newStudent.email
  delete newStudent.password // TODO implement change password for WP users

  const savedStudent = await getStudentByEmail(email)

  if (notNilNorEmpty(newStudent.discord)) {
    newStudent.discord = R.mergeDeepLeft(newStudent.discord, savedStudent.discord ?? {})
  }

  if (notNilNorEmpty(newStudent.metadata)) {
    if (notNilNorEmpty(newStudent.metadata?.profile)) {
      newStudent.metadata.profile = R.mergeDeepLeft(newStudent.metadata.profile, savedStudent.metadata?.profile ?? {})
    }

    if (notNilNorEmpty(savedStudent.metadata?.videoGames) && notNilNorEmpty(newStudent.metadata?.videoGames)) {
      newStudent.metadata.videoGames = R.pipe(
        R.concat(newStudent.metadata.videoGames ?? []),
        R.uniq
      )(savedStudent.metadata.videoGames)
    }

    if (notNilNorEmpty(newStudent.metadata?.valorant)) {
      newStudent.metadata.valorant = R.mergeDeepLeft(
        newStudent.metadata.valorant,
        savedStudent.metadata?.valorant ?? {}
      )
    }

    if (notNilNorEmpty(newStudent.metadata?.leagueOfLegends)) {
      newStudent.metadata.leagueOfLegends = R.mergeDeepLeft(
        newStudent.metadata.leagueOfLegends,
        savedStudent.metadata?.leagueOfLegends ?? {}
      )
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
