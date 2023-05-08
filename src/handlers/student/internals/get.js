import { buildHandler } from '~/utils'
import { serializeStudentInternal } from '~/serializers'
import { getStudentByUsernameInternal } from '~/services/students'
import { authenticationInternalMiddleware } from '~/middlewares'

const handler = async ({ params: { username }, query }, res) => {
  const result = await getStudentByUsernameInternal(username, query)
  return res.json(serializeStudentInternal(result))
}

export const getStudentInternalHandler = buildHandler('/students/internals/:username', 'get', handler, {
  middlewares: [authenticationInternalMiddleware],
})
