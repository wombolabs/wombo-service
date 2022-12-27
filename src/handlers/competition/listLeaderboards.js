import R from 'ramda'
import { getCompetitionByCodename } from '~/services/competitions'
import { listChannelsLeaderboard } from '~/services/providers/neatqueue'
import { buildHandler, notNilNorEmpty } from '~/utils'

const handler = async ({ params: { codename } }, res) => {
  let result = []

  const competition = await getCompetitionByCodename(codename, { isActive: true })

  if (notNilNorEmpty(competition)) {
    const leaderboard = R.path(['metadata', 'leaderboard', 'neatQueue'])(competition)

    if (notNilNorEmpty(leaderboard)) {
      const { discordGuild, apiKey, channels } = leaderboard
      result = await listChannelsLeaderboard(discordGuild, apiKey, channels)
    }
  }

  return res.json(result)
}

export const listCompetitionLeaderboardsHandler = buildHandler('/competitions/:codename/leaderboards', 'get', handler)
