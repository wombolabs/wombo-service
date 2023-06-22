import { buildHandler } from '~/utils'
import { authenticationInternalMiddleware } from '~/middlewares'
import { addChallengeToCompetition } from '~/services/competitions'
import { createChallenge } from '~/services/challenges'

const handler = async ({ params: { codename }, body }, res) => {
  const { ownerId, challengerId, ...challengeData } = body

  const challenge = await createChallenge(ownerId, challengeData, challengerId)

  await addChallengeToCompetition(codename, challenge.id)

  res.json({ added: true })
}

export const createChallengeCompetitionInternalHandler = buildHandler(
  '/competitions/internals/:codename/challenge',
  'post',
  handler,
  {
    middlewares: [authenticationInternalMiddleware],
  }
)
