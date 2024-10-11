import { authenticationMiddleware } from '~/middlewares'
import { createChallenge, txPayAndCreateChallenge } from '~/services/challenges'
import { buildHandler, notNilNorEmpty } from '~/utils'

const handler = async ({ user, body }, res) => {
  let result
  if (body?.betAmount > 0) {
    result = await txPayAndCreateChallenge(user?.id, body)
  } else {
    result = await createChallenge(user?.id, body)
  }

  res.json({ created: notNilNorEmpty(result) })
}

export const createChallengeHandler = buildHandler('/challenges', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
