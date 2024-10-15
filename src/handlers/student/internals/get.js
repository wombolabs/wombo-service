import { authenticationInternalMiddleware } from '~/middlewares'
import { serializeStudentInternal } from '~/serializers'
import { getStudentByUsernameInternal } from '~/services/students'
import { buildHandler } from '~/utils'

const handler = async ({ params: { username }, query }, res) => {
  const result = await getStudentByUsernameInternal(username, query)
  return res.json(serializeStudentInternal(result))
}

export const getStudentInternalHandler = buildHandler('/students/internals/:username', 'get', handler, {
  middlewares: [authenticationInternalMiddleware],
})
