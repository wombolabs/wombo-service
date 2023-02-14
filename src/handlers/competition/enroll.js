import { buildHandler, notNilNorEmpty } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { updateStudentByEmail } from '~/services/students'
import { enrollForCompetition, getCompetitionByCodename } from '~/services/competitions'
import { addGuildMemberRole } from '~/services/discord'

const handler = async ({ params: { codename }, user, body }, res) => {
  if (notNilNorEmpty(body)) {
    const { displayName, profile = {}, videoGames = [], valorant = {}, leagueOfLegends = {} } = body

    await updateStudentByEmail(user.email, {
      displayName,
      metadata: {
        profile,
        videoGames,
        valorant,
        leagueOfLegends,
      },
    })
  }

  await enrollForCompetition(codename, user.id)

  const { metadata } = await getCompetitionByCodename(codename)
  if (notNilNorEmpty(metadata?.discordRoles)) {
    await Promise.all(metadata.discordRoles.map((roleId) => addGuildMemberRole(user?.discord?.id, roleId)))
  }

  res.json({ enrolled: true })
}

export const enrollForCompetitionHandler = buildHandler('/competitions/:codename/enroll', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
