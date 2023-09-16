import { CHALLENGE_RESULTS, CHALLENGE_STATUSES, txPayPrizeChallenge, updateChallengeById } from '~/services/challenges'
import { buildHandler, notNilNorEmpty } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'

const handler = async ({ params: { id }, user, body }, res) => {
  const updatedChallenge = await updateChallengeById(id, body, user?.id)

  const isUpdated = notNilNorEmpty(updatedChallenge)
  if (
    isUpdated &&
    updatedChallenge?.status === CHALLENGE_STATUSES.FINISHED &&
    updatedChallenge?.competitionId == null &&
    updatedChallenge?.betAmount > 0
  ) {
    const { id: challengeId, ownerId, ownerScore, challengerId, challengerScore, betAmount, fee } = updatedChallenge

    if (ownerScore > challengerScore) {
      // won owner
      await txPayPrizeChallenge(ownerId, challengeId, betAmount, fee, CHALLENGE_RESULTS.WON)
    } else if (ownerScore < challengerScore) {
      // won challenger
      await txPayPrizeChallenge(challengerId, challengeId, betAmount, fee, CHALLENGE_RESULTS.WON)
    } else {
      // draw
      await Promise.allSettled([
        txPayPrizeChallenge(ownerId, challengeId, betAmount, fee, CHALLENGE_RESULTS.DRAW),
        txPayPrizeChallenge(challengerId, challengeId, betAmount, fee, CHALLENGE_RESULTS.DRAW),
      ])
    }
  }

  res.json({ updated: isUpdated })
}

export const updateChallengeHandler = buildHandler('/challenges/:id', 'patch', handler, {
  middlewares: [authenticationMiddleware],
})
