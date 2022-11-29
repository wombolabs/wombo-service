import { listChannelsLeaderboard } from '~/services/providers/neatqueue'
import { buildHandler } from '~/utils'

const handler = async (req, res) => {
  const result = await listChannelsLeaderboard()
  return res.json(result)
}

export const neatQueueChannelsLeaderboardHandler = buildHandler(
  '/providers/neatqueue/channelsleaderboard',
  'get',
  handler
)
