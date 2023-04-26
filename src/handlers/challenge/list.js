import { listChallenges } from '~/services/challenges'
import { buildHandler } from '~/utils'
import { serializeChallenges } from '~/serializers'

const handler = async ({ query }, res) => {
  const result = await listChallenges(query)
  return res.json(serializeChallenges(result))
}

export const listChallengesHandler = buildHandler('/challenges', 'get', handler)
