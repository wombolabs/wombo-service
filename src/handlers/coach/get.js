import { getCoach } from '~/services/coaches'
import { buildHandler } from '~/utils'

const handler = async ({ params: { username }, query }, res) => {
  const result = await getCoach(username, query)
  return res.json(result)
}

export const getCoachHandler = buildHandler('/coaches/:username', 'get', handler)
