import { buildHandler, notNilNorEmpty } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { updateStudentByEmail } from '~/services/students'
import { enrollForCompetition } from '~/services/competitions'

const handler = async ({ params: { codename }, user, body }, res) => {
  if (notNilNorEmpty(body)) {
    await updateStudentByEmail(user.email, body)
  }

  await enrollForCompetition(codename, user.id)

  res.json({ enrolled: true })
}

export const enrollForCompetitionHandler = buildHandler('/competitions/:codename/enroll', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
