import { CHALLENGE_STATUSES, updateChallengeById } from '~/services/challenges'
import { buildHandler, notNilNorEmpty } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { STUDENT_WALLET_TRANSACTION_TYPES, createWalletTransaction, getWalletByStudentId } from '~/services/students'

const pay = async (userId, prizePool, challengeId) => {
  const wallet = await getWalletByStudentId(userId)

  await createWalletTransaction(
    wallet?.id,
    prizePool,
    STUDENT_WALLET_TRANSACTION_TYPES.DEPOSIT,
    `won challenge ${challengeId}`
  )
}

const handler = async ({ params: { id }, body }, res) => {
  const updatedChallenge = await updateChallengeById(id, body)

  const isUpdated = notNilNorEmpty(updatedChallenge)
  if (
    isUpdated &&
    updatedChallenge?.status === CHALLENGE_STATUSES.FINISHED &&
    updatedChallenge?.competitionId == null &&
    updatedChallenge?.betAmount > 0
  ) {
    const { id: challengeId, ownerId, ownerScore, challengerId, challengerScore } = updatedChallenge
    const prizePool = updatedChallenge.betAmount * 2 - (updatedChallenge?.fee || 0)

    if (ownerScore > challengerScore) {
      // won owner
      await pay(ownerId, prizePool, challengeId)
    } else if (ownerScore < challengerScore) {
      // won challenger
      await pay(challengerId, prizePool, challengeId)
    } else {
      // draw
      await Promise.allSettled([
        pay(ownerId, prizePool / 2, challengeId),
        pay(challengerId, prizePool / 2, challengeId),
      ])
    }
  }

  res.json({ updated: isUpdated })
}

export const updateChallengeHandler = buildHandler('/challenges/:id', 'patch', handler, {
  middlewares: [authenticationMiddleware],
})
