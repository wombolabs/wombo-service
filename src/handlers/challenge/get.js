import { serializeChallenge } from '~/serializers'
import { getChallengeById } from '~/services/challenges'
import { buildHandler } from '~/utils'

const handler = async ({ params: { id }, query }, res) => {
  const result = await getChallengeById(id, query)
  return res.json(serializeChallenge(result))
}

export const getChallengeHandler = buildHandler('/challenges/:id', 'get', handler)
