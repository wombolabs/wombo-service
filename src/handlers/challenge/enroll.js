import { buildHandler, notNilNorEmpty } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import {
  CHALLENGE_STATUSES,
  enrollForChallengeById,
  getChallengeById,
  txPayAndEnrollChallenge,
} from '~/services/challenges'
import { RequestError } from '~/errors'

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

  let result
  if (savedChallenge?.betAmount > 0) {
    result = await txPayAndEnrollChallenge(user?.id, savedChallenge)
  } else {
    result = await enrollForChallengeById(id, user?.id)
  }

  res.json({ enrolled: notNilNorEmpty(result) })
}

export const enrollForChallengeHandler = buildHandler('/challenges/:id/enroll', 'patch', handler, {
  middlewares: [authenticationMiddleware],
})
