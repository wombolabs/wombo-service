import { discord as discordConfig } from '~/config'
import { addGuildMemberRole } from '~/services/discord'
import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { updateStudentByEmail } from '~/services/students'
import { InsufficientDataError } from '~/errors'

/**
 * body {
 *   leagueOfLegends {
 *     trackerUrl: string
 *     elo: string
 *     league: string
 *   }
 *   user {
 *     birthdate: string yyyy/mm/dd
 *     displayName: string
 *     country: string
 *   }
 * }
 */
const handler = async ({ user, body }, res) => {
  const { leagueOfLegends = {}, user: player = {} } = body

  const { discord = {} } = user
  if (discord?.id == null || discord?.accessToken == null || !discord?.scope.includes('guilds.join')) {
    throw new InsufficientDataError(`Discord required fields are missing for player ${user.email}.`)
  }

  const roleId = discordConfig.lolInHouseRoleIds[leagueOfLegends?.league?.toLowerCase()]
  if (!roleId) {
    throw new InsufficientDataError(`League of Legends required fields are missing for player ${user.email}.`)
  }
  await addGuildMemberRole(discord.id, roleId)

  const { displayName, birthdate, country } = player
  await updateStudentByEmail(user.email, {
    displayName,
    metadata: { birthdate, country, leagueOfLegends, leagueHubLoLEnrolled: true },
  })

  res.json({ enrolled: true })
}

export const leagueHubLoLEnrollmentHandler = buildHandler('/league/hub/lol/enrollment', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
