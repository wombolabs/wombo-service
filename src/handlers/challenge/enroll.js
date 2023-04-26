import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { createChallengeOnDiscord, enrollForChallenge } from '~/services/challenges'

const handler = async ({ params: { id }, user }, res) => {
  await enrollForChallenge(id, user?.id)

  await createChallengeOnDiscord(id)

  res.json({ enrolled: true })
}

export const enrollForChallengeHandler = buildHandler('/challenges/:id/enroll', 'patch', handler, {
  middlewares: [authenticationMiddleware],
})
