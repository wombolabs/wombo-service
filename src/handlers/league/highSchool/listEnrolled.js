import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { listStudentsHighSchoolEnrolled } from '~/services/students'
import { ForbiddenDataError } from '~/errors'

const handler = async ({ user }, res) => {
  if (!(/@wombo.gg/.test(user.email))) {
    throw new ForbiddenDataError()
  }

  const data = await listStudentsHighSchoolEnrolled()

  res.json(data)
}

export const leagueHighSchoolEnrolledHandler = buildHandler('/league/highschool/enrollment', 'get', handler, {
  middlewares: [authenticationMiddleware],
})
