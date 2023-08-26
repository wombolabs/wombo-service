import { CHALLENGE_RESULTS, CHALLENGE_STATUSES, updateChallengeById } from '~/services/challenges'
import { buildHandler, notNilNorEmpty } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { STUDENT_WALLET_TRANSACTION_TYPES, createWalletTransaction, getWalletByStudentId } from '~/services/students'

const pay = async (userId, betAmount, fee, challengeId, challengeResult) => {
  const wallet = await getWalletByStudentId(userId)

  const participants = challengeResult === CHALLENGE_RESULTS.DRAW ? 1 : 2 // if draw, divide prize by 2
  const feeAmount = fee > 0 ? betAmount * participants * (fee / 100) : 0
  const finalAmount = betAmount * participants - feeAmount

  await Promise.all([
    createWalletTransaction(
      wallet?.id,
      finalAmount,
      STUDENT_WALLET_TRANSACTION_TYPES.WON_CHALLENGE,
      `${challengeResult} challenge ${challengeId}`,
    ),
    createWalletTransaction(
      wallet?.id,
      feeAmount,
      STUDENT_WALLET_TRANSACTION_TYPES.CHALLENGE_FEE,
      `fee challenge ${challengeId}`,
    ),
  ])
}

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
      await pay(ownerId, betAmount, fee, challengeId, CHALLENGE_RESULTS.WON)
    } else if (ownerScore < challengerScore) {
      // won challenger
      await pay(challengerId, betAmount, fee, challengeId, CHALLENGE_RESULTS.WON)
    } else {
      // draw
      await Promise.allSettled([
        pay(ownerId, betAmount, fee, challengeId, CHALLENGE_RESULTS.DRAW),
        pay(challengerId, betAmount, fee, challengeId, CHALLENGE_RESULTS.DRAW),
      ])
    }
  }

  res.json({ updated: isUpdated })
}

export const updateChallengeHandler = buildHandler('/challenges/:id', 'patch', handler, {
  middlewares: [authenticationMiddleware],
})
