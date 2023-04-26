import { getStudentChallenges } from '~/services/students'
import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { serializeChallenges } from '~/serializers'

const handler = async ({ user, query }, res) => {
  const { challengesOwner, challengesChallenger } = await getStudentChallenges(user.email?.toLowerCase(), query)

  return res.json({
    owner: serializeChallenges(challengesOwner),
    challenger: serializeChallenges(challengesChallenger),
  })
}

export const getStudentMeChallengesHandler = buildHandler('/students/me/challenges', 'get', handler, {
  middlewares: [authenticationMiddleware],
})
