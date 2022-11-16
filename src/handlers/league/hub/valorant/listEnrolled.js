import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { listStudentsHubEnrolled } from '~/services/students'
import { ForbiddenDataError } from '~/errors'

const handler = async ({ user }, res) => {
  if (!(/@wombo.gg/.test(user.email))) {
    throw new ForbiddenDataError()
  }

  const data = await listStudentsHubEnrolled()

  res.json(data)
}

export const leagueHubEnrolledHandler = buildHandler('/league/hub/enrollment', 'get', handler, {
  middlewares: [authenticationMiddleware],
})
