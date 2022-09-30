import { discord as discordConfig } from '~/config'
import { addGuildMemberRole } from '~/services/discord'
import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { updateStudentByEmail } from '~/services/students'
import { InsufficientDataError } from '~/errors'

/**
 * body {
 *   valorant {
 *     trackerUrl: string
 *     elo: string
 *     league: string
 *   }
 *   faceItId: string
 *   user {
 *     birthday: string yyyy-mm-dd
 *     displayName: string
 *     country: string
 *   }
 * }
 */
const handler = async ({ user, body }, res) => {
  const { valorant = {}, faceItId, user: player = {} } = body

  const { discord = {} } = user
  if (discord?.id == null || discord?.accessToken == null || !discord?.scope.includes('guilds.join')) {
    throw new InsufficientDataError(`Discord required fields are missing for player ${user.email}.`)
  }

  const roleId = discordConfig.leagueHubRoleIds[valorant?.league?.toLowerCase()]
  if (!roleId) {
    throw new InsufficientDataError(`VALORANT required fields are missing for player ${user.email}.`)
  }
  await addGuildMemberRole(discord.id, roleId)

  const { displayName, birthday, country } = player
  await updateStudentByEmail(user.email, {
    displayName,
    metadata: { birthday, country, valorant, faceItId, leagueHubEnrolled: true },
  })

  res.json({ enrolled: true })
}

export const leagueHubEnrollmentHandler = buildHandler('/league/hub/enrollment', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
