import { buildHandler } from '~/utils'
import { authenticationInternalMiddleware } from '~/middlewares'
import { createCompetitionTournament } from '~/services/competitions'
import { ASYNC_API_GATEWAY_EVENT_SOURCE_NAME, asyncApiGateway } from '~/eventSources'

const handler = async ({ params: { codename }, body }, res) => {
  await createCompetitionTournament(codename, body)

  return res.status(204).end()
}

export const createCompetitionTournamentInternalHandler = buildHandler(
  '/competitions/internals/:codename/tournament',
  'post',
  handler,
  {
    middlewares: [authenticationInternalMiddleware],
    eventSourceName: ASYNC_API_GATEWAY_EVENT_SOURCE_NAME,
    eventSource: asyncApiGateway,
  }
)
