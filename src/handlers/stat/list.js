import { serializeStats } from '~/serializers'
import { listStats } from '~/services/stats'
import { buildHandler } from '~/utils'

const handler = async (req, res) => {
  const result = await listStats()
  return res.json(serializeStats(result))
}

export const listStatsHandler = buildHandler('/stats', 'get', handler)
