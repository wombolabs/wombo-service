import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { enrollForChallenge } from '~/services/challenges'

const handler = async ({ params: { id }, user }, res) => {
  await enrollForChallenge(id, user?.id)
  res.json({ enrolled: true })
}

export const enrollForChallengeHandler = buildHandler('/challenges/:id/enroll', 'patch', handler, {
  middlewares: [authenticationMiddleware],
})
