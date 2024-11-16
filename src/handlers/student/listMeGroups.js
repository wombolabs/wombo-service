import { authenticationMiddleware } from '~/middlewares'
import { serializeGroups } from '~/serializers'
import { listGroups } from '~/services/groups'
import { buildHandler } from '~/utils'

const handler = async ({ user, query }, res) => {
  const result = await listGroups({ ...query, studentId: user?.id })
  return res.json(serializeGroups(result))
}

export const listStudentMeGroupsHandler = buildHandler('/students/me/groups', 'get', handler, {
  middlewares: [authenticationMiddleware],
})
