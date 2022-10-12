import { discord as discordConfig } from '~/config'
import { addGuildMemberRole } from '~/services/discord'
import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { updateStudentByEmail } from '~/services/students'
import { InsufficientDataError } from '~/errors'

/**
 * body {
 *   highSchoolId: string uuid
 *   highSchoolStudyYear: number
 *   teamName: string
 *   videoGameId: string uuid
 *   user {
 *     birthdate: string yyyy/mm/dd
 *     displayName: string
 *     cellphone: string
 *     country: string
 *     state: string
 *   }
 * }
 */
const handler = async ({ user, body }, res) => {
  const { highSchoolId, highSchoolStudyYear, videoGameId, teamName, user: player = {} } = body

  const { discord = {} } = user
  if (discord?.id == null || discord?.accessToken == null || !discord?.scope.includes('guilds.join')) {
    throw new InsufficientDataError(`Discord required fields are missing for player ${user.email}.`)
  }

  await addGuildMemberRole(discord.id, discordConfig.leagueHighSchoolRoleId)

  const { displayName, birthdate, cellphone, country, state } = player
  await updateStudentByEmail(user.email, {
    displayName,
    metadata: {
      videoGameId,
      birthdate,
      cellphone,
      country,
      state,
      highSchoolId,
      highSchoolStudyYear,
      teamName,
      leagueHighSchoolEnrolled: true,
    },
  })

  res.json({ enrolled: true })
}

export const leagueHighSchoolEnrollmentHandler = buildHandler('/league/highschool/enrollment', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
