import { CHALLENGE_RESULTS, CHALLENGE_STATUSES, txPayPrizeChallenge, finishChallengeById } from '~/services/challenges'
import { buildHandler, notNilNorEmpty } from '~/utils'
import { authenticationInternalMiddleware } from '~/middlewares'
import { updateCompetitionBrackets } from '~/services/competitions'

const handler = async ({ params: { id }, body }, res) => {
  const updatedChallenge = await finishChallengeById(id, body)

  const isFinished = updatedChallenge?.status === CHALLENGE_STATUSES.FINISHED
  if (isFinished && updatedChallenge?.competitionId == null && updatedChallenge?.betAmount > 0) {
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

  if (updatedChallenge?.status === CHALLENGE_STATUSES.FINISHED && notNilNorEmpty(updatedChallenge?.competitionId)) {
    await updateCompetitionBrackets(updatedChallenge)
  }

  res.json({ finished: isFinished })
}

export const finishChallengeInternalHandler = buildHandler('/challenges/internals/:id/finish', 'post', handler, {
  middlewares: [authenticationInternalMiddleware],
})
