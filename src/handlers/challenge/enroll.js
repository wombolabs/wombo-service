import R from 'ramda'

import { RequestError } from '~/errors'
import { authenticationMiddleware } from '~/middlewares'
import { CHALLENGE_STATUSES, getChallengeById, txPayAndEnrollChallenge } from '~/services/challenges'
import { buildHandler, notNilNorEmpty } from '~/utils'

const handler = async ({ params: { id }, user }, res) => {
  const savedChallenge = await getChallengeById(id, { isActive: true })

  // user cannot enroll for his own challenge
  if (savedChallenge?.owner?.id === user?.id) {
    throw new RequestError(null, 'Owner error on enroll for challenge.')
  }

  // user can enroll only for published challenges
  if (savedChallenge?.status !== CHALLENGE_STATUSES.PUBLISHED) {
    throw new RequestError(null, 'Status error on enroll challenge.')
  }

  const result = await txPayAndEnrollChallenge(
    user?.id,
    R.pick(['id', 'betAmount', 'challengerBetAmount'], savedChallenge),
  )

  res.json({ enrolled: notNilNorEmpty(result) })
}

export const enrollForChallengeHandler = buildHandler('/challenges/:id/enroll', 'patch', handler, {
  middlewares: [authenticationMiddleware],
})
