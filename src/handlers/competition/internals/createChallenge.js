import { authenticationInternalMiddleware } from '~/middlewares'
import { createChallenge } from '~/services/challenges'
import { addChallengeToCompetition } from '~/services/competitions'
import { buildHandler } from '~/utils'

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
  },
)
