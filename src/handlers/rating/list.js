import { serializeRatings } from '~/serializers'
import { listRatings } from '~/services/ratings'
import { buildHandler } from '~/utils'

const handler = async (req, res) => {
  const result = await listRatings()
  return res.json(serializeRatings(result))
}

export const listRatingsHandler = buildHandler('/ratings', 'get', handler)
