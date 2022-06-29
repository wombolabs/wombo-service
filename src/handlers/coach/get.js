import { getCoachByUsername } from '~/services/coaches'
import { buildHandler } from '~/utils'
import { serializeCoach } from '~/serializers'

const handler = async ({ params: { username }, query }, res) => {
  const result = await getCoachByUsername(username, query)
  return res.json(serializeCoach(result))
}

export const getCoachHandler = buildHandler('/coaches/:username', 'get', handler)
