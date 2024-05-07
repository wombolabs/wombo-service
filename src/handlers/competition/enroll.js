import { buildHandler, notNilNorEmpty } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { updateStudentByEmail } from '~/services/students'
import { enrollForCompetition } from '~/services/competitions'

/**
 * Enroll for a competition
 *
 * @param {object} req
 *  @param {object} params
 *    - {string} codename
 *  @param {object} user
 *  @param {object} body
 *   - {object} metadata // student data
 *   - {object} predictions
 * @param {object} res
 * @returns {Promise<void>}
 */
const handler = async ({ params: { codename }, user, body }, res) => {
  const { predictions, ...studentData } = body ?? {}

  if (notNilNorEmpty(studentData)) {
    await updateStudentByEmail(user.email, studentData)
  }

  await enrollForCompetition(codename, user.id, { predictions })

  res.json({ enrolled: true })
}

export const enrollForCompetitionHandler = buildHandler('/competitions/:codename/enroll', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
