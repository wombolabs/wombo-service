import { authenticationMiddleware } from '~/middlewares'
import { updateGroupById } from '~/services/groups'
import { buildHandler, notNilNorEmpty } from '~/utils'

const handler = async ({ params: { id }, user, body }, res) => {
  const result = await updateGroupById(id, user?.id, body)
  res.json({ updated: notNilNorEmpty(result) })
}

export const updateGroupHandler = buildHandler('/groups/:id', 'patch', handler, {
  middlewares: [authenticationMiddleware],
})
