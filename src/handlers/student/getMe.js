import { getStudentByEmail } from '~/services/students'
import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'

const handler = async ({ user, query }, res) => {
  const result = await getStudentByEmail(user.email?.toLowerCase(), query)
  return res.json(result)
}

export const getStudentMeHandler = buildHandler('/students/me', 'get', handler, {
  middlewares: [authenticationMiddleware],
})
