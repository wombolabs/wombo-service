import { authenticationMiddleware } from '~/middlewares'
import { cancelChallengeById, CHALLENGE_STATUSES } from '~/services/challenges'
import { createWalletTransaction, getWalletByStudentId, STUDENT_WALLET_TRANSACTION_TYPES } from '~/services/students'
import { buildHandler } from '~/utils'

const handler = async ({ params: { id }, user }, res) => {
  const challenge = await cancelChallengeById(id, user?.id)

  if (challenge?.status === CHALLENGE_STATUSES.CANCELLED && challenge?.betAmount > 0) {
    const wallet = await getWalletByStudentId(user?.id)

    await createWalletTransaction(
      wallet?.id,
      challenge.betAmount,
      STUDENT_WALLET_TRANSACTION_TYPES.REFUND,
      `cancelled challenge ${challenge?.id}`,
    )
  }

  res.json({ cancelled: true })
}

export const cancelChallengeHandler = buildHandler('/challenges/:id/cancel', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
