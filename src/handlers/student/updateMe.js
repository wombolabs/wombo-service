import { authenticationMiddleware } from '~/middlewares'
import { serializeStudent } from '~/serializers'
import { updateStudentByEmail } from '~/services/students'
import { buildHandler } from '~/utils'

const handler = async ({ user, body }, res) => {
  const result = await updateStudentByEmail(user.email?.toLowerCase(), body)
  return res.json(serializeStudent(result))
}

export const updateStudentMeHandler = buildHandler('/students/me', 'patch', handler, {
  middlewares: [authenticationMiddleware],
})
