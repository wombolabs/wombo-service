import { buildHandler, notNilNorEmpty } from '~/utils'
import { authenticationInternalMiddleware } from '~/middlewares'
import { createCompetition } from '~/services/competitions'

const handler = async ({ body }, res) => {
  const result = await createCompetition(body)
  res.json({ created: notNilNorEmpty(result) })
}

export const createCompetitionInternalHandler = buildHandler('/competitions/internals', 'post', handler, {
  middlewares: [authenticationInternalMiddleware],
})
