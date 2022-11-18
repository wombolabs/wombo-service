import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { listStudentsFreePassEnrolled } from '~/services/students'
import { ForbiddenDataError } from '~/errors'

const handler = async ({ user }, res) => {
  if (!(/@wombo.gg/.test(user.email))) {
    throw new ForbiddenDataError()
  }

  const data = await listStudentsFreePassEnrolled()

  res.json(data)
}

export const listStudentsFreePassEnrolledHandler = buildHandler('/students/freepass', 'get', handler, {
  middlewares: [authenticationMiddleware],
})
