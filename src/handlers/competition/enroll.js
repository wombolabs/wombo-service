import { buildHandler, notNilNorEmpty } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { updateStudentByEmail } from '~/services/students'
import { enrollForCompetition } from '~/services/competitions'

/**
 * body {
 *   profile {
 *     username: string
 *     birthdate: string yyyy/mm/dd
 *     displayName: string
 *     cellphone: string
 *     country: string
 *     state: string
 *     city: string
 *   }
 *   videoGames: [string]
 *   valorant {
 *     teamRole: PLAYER | CAPTAIN
 *     role:
 *     trackerUrl: string
 *     elo: string
 *     league: string
 *   }
 *   leagueOfLegends {
 *     teamRole: PLAYER | CAPTAIN
 *     role: TOP | JUNGLE | MID | ADC | SUPPORT
 *     trackerUrl: string
 *     elo: string
 *     league: string
 *   }
 * }
 */
const handler = async ({ params: { codename }, user, body }, res) => {
  if (notNilNorEmpty(body)) {
    const { profile = {}, videoGames = [], valorant = {}, leagueOfLegends = {} } = body

    await updateStudentByEmail(user.email, {
      displayName: profile.displayName,
      metadata: {
        profile,
        videoGames,
        valorant,
        leagueOfLegends,
      },
    })
  }

  await enrollForCompetition(codename, user.id)

  res.json({ enrolled: true })
}

export const enrollForCompetitionHandler = buildHandler('/competitions/:codename/enroll', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
