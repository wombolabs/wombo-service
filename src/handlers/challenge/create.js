import { authenticationMiddleware } from '~/middlewares'
import { txPayAndCreateChallenge } from '~/services/challenges'
import { buildHandler, notNilNorEmpty } from '~/utils'

const handler = async ({ user, body }, res) => {
  const result = await txPayAndCreateChallenge(user?.id, body)
  res.json({ created: notNilNorEmpty(result) })
}

export const createChallengeHandler = buildHandler('/challenges', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
