import { authenticationMiddleware } from '~/middlewares'
import { createGroup } from '~/services/groups'
import { buildHandler, notNilNorEmpty } from '~/utils'

const handler = async ({ user, body }, res) => {
  const result = await createGroup(user?.id, body)
  res.json({ created: notNilNorEmpty(result) })
}

export const createGroupHandler = buildHandler('/groups', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
