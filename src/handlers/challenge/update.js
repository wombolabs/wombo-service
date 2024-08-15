import {
  CHALLENGE_RESULTS,
  CHALLENGE_STATUSES,
  CHALLENGE_USER_TYPE,
  txPayPrizeChallenge,
  updateChallengeById,
} from '~/services/challenges'
import { buildHandler, notNilNorEmpty } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { updateCompetitionBrackets } from '~/services/competitions'

const handler = async ({ params: { id }, user, body }, res) => {
  const updatedChallenge = await updateChallengeById(id, body, user?.id)

  const isUpdated = notNilNorEmpty(updatedChallenge)
  if (
    isUpdated &&
    updatedChallenge?.status === CHALLENGE_STATUSES.FINISHED &&
    updatedChallenge?.competitionId == null &&
    updatedChallenge?.betAmount > 0
  ) {
    const {
      id: challengeId,
      ownerId,
      ownerScore,
      challengerId,
      challengerScore,
      betAmount,
      challengerBetAmount,
      fee,
    } = updatedChallenge

    if (ownerScore > challengerScore) {
      // won owner
      await txPayPrizeChallenge(
        CHALLENGE_USER_TYPE.OWNER,
        ownerId,
        challengeId,
        betAmount,
        challengerBetAmount,
        fee,
        CHALLENGE_RESULTS.WON,
      )
    } else if (ownerScore < challengerScore) {
      // won challenger
      await txPayPrizeChallenge(
        CHALLENGE_USER_TYPE.CHALLENGER,
        challengerId,
        challengeId,
        betAmount,
        challengerBetAmount,
        fee,
        CHALLENGE_RESULTS.WON,
      )
    } else {
      // draw
      await Promise.allSettled([
        txPayPrizeChallenge(
          CHALLENGE_USER_TYPE.OWNER,
          ownerId,
          challengeId,
          betAmount,
          challengerBetAmount,
          fee,
          CHALLENGE_RESULTS.DRAW,
        ),
        txPayPrizeChallenge(
          CHALLENGE_USER_TYPE.CHALLENGER,
          challengerId,
          challengeId,
          betAmount,
          challengerBetAmount,
          fee,
          CHALLENGE_RESULTS.DRAW,
        ),
      ])
    }
  }

  if (updatedChallenge?.status === CHALLENGE_STATUSES.FINISHED && notNilNorEmpty(updatedChallenge?.competitionId)) {
    await updateCompetitionBrackets(updatedChallenge)
  }

  res.json({ updated: isUpdated })
}

export const updateChallengeHandler = buildHandler('/challenges/:id', 'patch', handler, {
  middlewares: [authenticationMiddleware],
})
