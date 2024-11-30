import { authenticationMiddleware } from '~/middlewares'
import { serializeGroup } from '~/serializers'
import { getGroupCategoryById } from '~/services/groups'
import { buildHandler } from '~/utils'

const handler = async ({ params: { id } }, res) => {
  const result = await getGroupCategoryById(id)
  return res.json(serializeGroup(result))
}

export const getGroupCategoryHandler = buildHandler('/groups/:id/category', 'get', handler, {
  middlewares: [authenticationMiddleware],
})
