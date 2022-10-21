import { listHubsLeaderboard } from '~/services/providers/faceit'
import { buildHandler } from '~/utils'

const handler = async (req, res) => {
  const result = await listHubsLeaderboard()
  return res.json(result)
}

export const faceItHubsLeaderboardHandler = buildHandler('/providers/faceit/hubsleaderboard', 'get', handler)
