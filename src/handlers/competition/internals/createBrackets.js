import { ASYNC_API_GATEWAY_EVENT_SOURCE_NAME, asyncApiGateway } from '~/eventSources'
import { authenticationInternalMiddleware } from '~/middlewares'
import { createCompetitionBrackets } from '~/services/competitions/createCompetitionBrackets'
import { buildHandler } from '~/utils'

const handler = async ({ params: { codename }, body }, res) => {
  await createCompetitionBrackets(codename, body)

  return res.status(204).end()
}

export const createCompetitionBracketsInternalHandler = buildHandler(
  '/competitions/internals/:codename/brackets',
  'post',
  handler,
  {
    middlewares: [authenticationInternalMiddleware],
    eventSourceName: ASYNC_API_GATEWAY_EVENT_SOURCE_NAME,
    eventSource: asyncApiGateway,
  },
)
