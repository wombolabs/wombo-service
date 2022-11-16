import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { listStudentsHubLoLEnrolled } from '~/services/students'
import { ForbiddenDataError } from '~/errors'

const handler = async ({ user }, res) => {
  if (!(/@wombo.gg/.test(user.email))) {
    throw new ForbiddenDataError()
  }

  const data = await listStudentsHubLoLEnrolled()

  res.json(data)
}

export const leagueHubLoLEnrolledHandler = buildHandler('/league/hub/lol/enrollment', 'get', handler, {
  middlewares: [authenticationMiddleware],
})
