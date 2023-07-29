import { CHALLENGE_RESULTS, CHALLENGE_STATUSES, updateChallengeById } from '~/services/challenges'
import { buildHandler, notNilNorEmpty } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { STUDENT_WALLET_TRANSACTION_TYPES, createWalletTransaction, getWalletByStudentId } from '~/services/students'

const pay = async (userId, prizePool, challengeId, challengeResult) => {
  const wallet = await getWalletByStudentId(userId)

  await createWalletTransaction(
    wallet?.id,
    prizePool,
    STUDENT_WALLET_TRANSACTION_TYPES.WON_CHALLENGE,
    `${challengeResult} challenge ${challengeId}`
  )
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
    const { id: challengeId, ownerId, ownerScore, challengerId, challengerScore } = updatedChallenge
    const prizePool = updatedChallenge.betAmount * 2 - (updatedChallenge?.fee ?? 0)

    if (ownerScore > challengerScore) {
      // won owner
      await pay(ownerId, prizePool, challengeId, CHALLENGE_RESULTS.WON)
    } else if (ownerScore < challengerScore) {
      // won challenger
      await pay(challengerId, prizePool, challengeId, CHALLENGE_RESULTS.WON)
    } else {
      // draw
      await Promise.allSettled([
        pay(ownerId, prizePool / 2, challengeId, CHALLENGE_RESULTS.DRAW),
        pay(challengerId, prizePool / 2, challengeId, CHALLENGE_RESULTS.DRAW),
      ])
    }
  }

  res.json({ updated: isUpdated })
}

export const updateChallengeHandler = buildHandler('/challenges/:id', 'patch', handler, {
  middlewares: [authenticationMiddleware],
})
