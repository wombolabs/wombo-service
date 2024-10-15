import { authenticationMiddleware } from '~/middlewares'
import { serializeStudent } from '~/serializers'
import { getStudentByEmail } from '~/services/students'
import { buildHandler } from '~/utils'

const handler = async ({ user, query }, res) => {
  const result = await getStudentByEmail(user.email?.toLowerCase(), query)
  return res.json(serializeStudent(result))
}

export const getStudentMeHandler = buildHandler('/students/me', 'get', handler, {
  middlewares: [authenticationMiddleware],
})
