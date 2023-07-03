import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { CHALLENGE_STATUSES, cancelChallengeById } from '~/services/challenges'
import { STUDENT_WALLET_TRANSACTION_TYPES, createWalletTransaction, getWalletByStudentId } from '~/services/students'

const handler = async ({ params: { id }, user }, res) => {
  const challenge = await cancelChallengeById(id, user?.id)

  if (challenge?.status === CHALLENGE_STATUSES.CANCELLED && challenge?.betAmount > 0) {
    const wallet = await getWalletByStudentId(user.id)

    await createWalletTransaction(
      wallet?.id,
      challenge.betAmount,
      STUDENT_WALLET_TRANSACTION_TYPES.REFUND,
      `cancelled challenge ${challenge?.id}`
    )
  }

  res.json({ cancelled: true })
}

export const cancelChallengeHandler = buildHandler('/challenges/:id/cancel', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
