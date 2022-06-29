import { listCoaches } from '~/services/coaches'
import { buildHandler } from '~/utils'
import { serializeCoaches } from '~/serializers'

const handler = async ({ query }, res) => {
  const result = await listCoaches(query)
  return res.json(serializeCoaches(result))
}

export const listCoachesHandler = buildHandler('/coaches', 'get', handler)
