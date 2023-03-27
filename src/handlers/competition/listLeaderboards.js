import R from 'ramda'
import { getCompetitionByCodename } from '~/services/competitions'
import { listChannelsLeaderboard } from '~/services/providers/neatqueue'
import { getStudentByDiscordId } from '~/services/students'
import { getVideoGameById } from '~/services/videoGames'
import { buildHandler, notNilNorEmpty } from '~/utils'

const handler = async ({ params: { codename } }, res) => {
  let result = []
  let videoGame = null

  const competition = await getCompetitionByCodename(codename, { isActive: true })

  if (notNilNorEmpty(competition)) {
    const leaderboard = R.path(['metadata', 'leaderboard', 'neatQueue'])(competition)

    if (notNilNorEmpty(leaderboard)) {
      const { discordGuild, apiKey, channels } = leaderboard
      try {
        result = await listChannelsLeaderboard(discordGuild, apiKey, channels)

        videoGame = await getVideoGameById(competition.videoGame)
      } catch (err) {
        result = []
      }

      if (notNilNorEmpty(videoGame)) {
        const resultPromises = R.map(async (lb) => {
          const itemsPromises = R.map(async (player) => {
            const student = await getStudentByDiscordId(player.id)

            return {
              country: student?.metadata?.profile?.country || '',
              teamName: student?.metadata[videoGame?.codename]?.teamName || '',
              ...player,
              username: student?.username || player.username,
            }
          })(lb.items)

          const items = await Promise.all(itemsPromises)
          return { name: lb.name, items }
        })(result)

        result = await Promise.all(resultPromises)
      }
    }
  }

  return res.json(result)
}

export const listCompetitionLeaderboardsHandler = buildHandler('/competitions/:codename/leaderboards', 'get', handler)
