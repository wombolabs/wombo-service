import { authenticationMiddleware } from '~/middlewares'
import { serializeGroup } from '~/serializers'
import { getGroupById } from '~/services/groups'
import { buildHandler } from '~/utils'

const handler = async ({ user, params: { id }, query }, res) => {
  const result = await getGroupById(id, user?.id, query)
  return res.json(serializeGroup(result))
}

export const getGroupHandler = buildHandler('/groups/:id', 'get', handler, {
  middlewares: [authenticationMiddleware],
})
