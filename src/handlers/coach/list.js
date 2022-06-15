import { listCoaches } from '~/services/coaches'
import { buildHandler } from '~/utils'

const handler = async ({ query }, res) => {
  const result = await listCoaches(query)
  return res.json(result)
}

export const listCoachesHandler = buildHandler('/coaches', 'get', handler)
