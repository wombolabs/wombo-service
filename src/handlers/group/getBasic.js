import { authenticationMiddleware } from '~/middlewares'
import { serializeGroup } from '~/serializers'
import { getGroupBasicById } from '~/services/groups/getGroupBasicById'
import { buildHandler } from '~/utils'

const handler = async ({ params: { id } }, res) => {
  const result = await getGroupBasicById(id)
  return res.json(serializeGroup(result))
}

export const getGroupBasicHandler = buildHandler('/groups/:id/basic', 'get', handler, {
  middlewares: [authenticationMiddleware],
})
