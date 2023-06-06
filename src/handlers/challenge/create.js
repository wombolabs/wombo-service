import { createChallenge } from '~/services/challenges'
import { buildHandler, notNilNorEmpty } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'

const handler = async ({ user, body }, res) => {
  const result = await createChallenge(user?.id, body)
  res.json({ created: notNilNorEmpty(result) })
}

export const createChallengeHandler = buildHandler('/challenges', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
