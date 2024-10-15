import { serializeChallenges } from '~/serializers'
import { listChallenges } from '~/services/challenges'
import { buildHandler } from '~/utils'

const handler = async ({ query }, res) => {
  const result = await listChallenges({ ...query, studentId: null })
  return res.json(serializeChallenges(result))
}

export const listChallengesHandler = buildHandler('/challenges', 'get', handler)
