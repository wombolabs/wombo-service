import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { serializeChallenges } from '~/serializers'
import { listChallenges } from '~/services/challenges'

const handler = async ({ user, query }, res) => {
  const result = await listChallenges({ ...query, studentId: user?.id })
  return res.json(serializeChallenges(result))
}

export const getStudentMeChallengesHandler = buildHandler('/students/me/challenges', 'get', handler, {
  middlewares: [authenticationMiddleware],
})
