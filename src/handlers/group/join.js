import { authenticationMiddleware } from '~/middlewares'
import { joinGroupById } from '~/services/groups'
import { buildHandler, notNilNorEmpty } from '~/utils'

const handler = async ({ params: { id }, user }, res) => {
  const result = await joinGroupById(id, user?.id)
  res.json({ joined: notNilNorEmpty(result) })
}

export const joinGroupHandler = buildHandler('/groups/:id/join', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
