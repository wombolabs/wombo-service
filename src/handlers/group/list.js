import { authenticationMiddleware } from '~/middlewares'
import { serializeGroups } from '~/serializers'
import { listGroups } from '~/services/groups/listGroups'
import { buildHandler } from '~/utils'

const handler = async ({ query }, res) => {
  const result = await listGroups(query)
  return res.json(serializeGroups(result))
}

export const listGroupsHandler = buildHandler('/groups', 'get', handler, {
  middlewares: [authenticationMiddleware],
})
