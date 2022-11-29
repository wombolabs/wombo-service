import { listChannelsQueue } from '~/services/providers/neatqueue'
import { buildHandler } from '~/utils'

const handler = async (req, res) => {
  const result = await listChannelsQueue()
  return res.json(result)
}

export const neatQueueChannelsQueueHandler = buildHandler('/providers/neatqueue/channelsqueue', 'get', handler)
