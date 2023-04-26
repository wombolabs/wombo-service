import { createChallenge } from '~/services/challenges'
import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'

const handler = async ({ user, body }, res) => {
  await createChallenge(user?.id, body)
  res.json({ created: true })
}

export const createChallengeHandler = buildHandler('/challenges', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
