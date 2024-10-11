import { authenticationInternalMiddleware } from '~/middlewares'
import {
  cancelChallengeByIdInternals,
  CHALLENGE_STATUSES,
  CHALLENGE_USER_TYPE,
  txPayRefundChallenge,
} from '~/services/challenges'
import { buildHandler } from '~/utils'

const handler = async ({ params: { id } }, res) => {
  const updatedChallenge = await cancelChallengeByIdInternals(id)

  const isCancelled = updatedChallenge?.status === CHALLENGE_STATUSES.CANCELLED
  if (isCancelled && updatedChallenge?.betAmount > 0) {
    const { id: challengeId, ownerId, challengerId, betAmount, challengerBetAmount } = updatedChallenge

    await Promise.allSettled([
      txPayRefundChallenge(CHALLENGE_USER_TYPE.OWNER, ownerId, challengeId, betAmount, challengerBetAmount),
      txPayRefundChallenge(CHALLENGE_USER_TYPE.CHALLENGER, challengerId, challengeId, betAmount, challengerBetAmount),
    ])
  }

  res.json({ cancelled: isCancelled })
}

export const cancelChallengeInternalHandler = buildHandler('/challenges/internals/:id/cancel', 'post', handler, {
  middlewares: [authenticationInternalMiddleware],
})
