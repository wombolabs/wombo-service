import { CHALLENGE_STATUSES, cancelChallengeByIdInternals, txPayRefundChallenge } from '~/services/challenges'
import { buildHandler } from '~/utils'
import { authenticationInternalMiddleware } from '~/middlewares'

const handler = async ({ params: { id } }, res) => {
  const updatedChallenge = await cancelChallengeByIdInternals(id)
console.log('updatedChallenge', updatedChallenge)
  const isCancelled = updatedChallenge?.status === CHALLENGE_STATUSES.CANCELLED
  if (isCancelled && updatedChallenge?.betAmount > 0) {
    const { id: challengeId, ownerId, challengerId, betAmount } = updatedChallenge

    await Promise.allSettled([
      txPayRefundChallenge(ownerId, challengeId, betAmount),
      txPayRefundChallenge(challengerId, challengeId, betAmount),
    ])
  }

  res.json({ cancelled: isCancelled })
}

export const cancelChallengeInternalHandler = buildHandler('/challenges/internals/:id/cancel', 'post', handler, {
  middlewares: [authenticationInternalMiddleware],
})
