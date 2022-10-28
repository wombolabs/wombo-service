import { listHubsQueue } from '~/services/providers/faceit'
import { buildHandler } from '~/utils'

const handler = async (req, res) => {
  const result = await listHubsQueue()
  return res.json(result)
}

export const faceItHubsQueueHandler = buildHandler('/providers/faceit/hubsqueue', 'get', handler)
