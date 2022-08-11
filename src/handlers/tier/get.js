import { getTierById } from '~/services/tiers'
import { buildHandler } from '~/utils'
import { serializeTier } from '~/serializers'

const handler = async ({ params: { id }, query: { extraFields = [] } }, res) => {
  const result = await getTierById(id)
  return res.json(serializeTier(extraFields)(result))
}

export const getTierHandler = buildHandler('/tiers/:id', 'get', handler)
