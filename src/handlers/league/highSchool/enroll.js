import { discord as discordConfig } from '~/config'
import { addGuildMemberRole } from '~/services/discord'
import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { updateStudentByEmail } from '~/services/students'
import { InsufficientDataError } from '~/errors'

/**
 * body {
 *   highSchoolName: string
 *   highSchoolYear: number
 *   teamName: string
 *   videoGames: [string]
 *   user {
 *     birthdate: string yyyy/mm/dd
 *     displayName: string
 *     cellphone: string
 *     country: string
 *     state: string
 *     city: string
 *   }
 * }
 */
const handler = async ({ user, body }, res) => {
  const { highSchoolName, highSchoolYear, videoGames, teamName, teamHaveCoach, user: player = {} } = body

  const { discord = {} } = user
  if (discord?.id == null || discord?.accessToken == null || !discord?.scope.includes('guilds.join')) {
    throw new InsufficientDataError(`Discord required fields are missing for player ${user.email}.`)
  }

  await addGuildMemberRole(discord.id, discordConfig.leagueHighSchoolRoleId)

  const { displayName, birthdate, cellphone, country, state, city } = player
  await updateStudentByEmail(user.email, {
    displayName,
    metadata: {
      videoGames,
      birthdate,
      cellphone,
      country,
      state,
      city,
      highSchoolName,
      highSchoolYear,
      teamName,
      teamHaveCoach,
      leagueHighSchoolEnrolled: true,
    },
  })

  res.json({ enrolled: true })
}

export const leagueHighSchoolEnrollmentHandler = buildHandler('/league/highschool/enrollment', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
