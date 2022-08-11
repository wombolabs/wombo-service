import { updateStudentByEmail } from '~/services/students'
import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { serializeStudent } from '~/serializers'

const handler = async ({ user, body }, res) => {
  const result = await updateStudentByEmail(user.email?.toLowerCase(), body)
  return res.json(serializeStudent(result))
}

export const updateStudentMeHandler = buildHandler('/students/me', 'put', handler, {
  middlewares: [authenticationMiddleware],
})
