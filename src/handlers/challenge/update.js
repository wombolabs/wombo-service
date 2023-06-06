import { updateChallengeById } from '~/services/challenges'
import { buildHandler, notNilNorEmpty } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'

const handler = async ({ params: { id }, body }, res) => {
  const result = await updateChallengeById(id, body)
  res.json({ updated: notNilNorEmpty(result) })
}

export const updateChallengeHandler = buildHandler('/challenges/:id', 'patch', handler, {
  middlewares: [authenticationMiddleware],
})
