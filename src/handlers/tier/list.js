import { listTiers } from '~/services/tiers'
import { buildHandler } from '~/utils'
import { serializeTiers } from '~/serializers'

const handler = async ({ query }, res) => {
  const result = await listTiers(query)
  return res.json(serializeTiers(result))
}

export const listTiersHandler = buildHandler('/tiers', 'get', handler)
