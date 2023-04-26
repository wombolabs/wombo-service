import { buildHandler } from '~/utils'
import * as Sentry from '@sentry/serverless'
import { authenticationMiddleware } from '~/middlewares'
import { isOffline } from '~/config'

const handler = async ({ body }, res) => {
  try {
    console.log(body)

    // Return a response to acknowledge receipt of the event
    return res.json()
  } catch (error) {
    if (isOffline) {
      console.error(error)
    }
    Sentry.captureException(error)

    return res.status(error.statusCode ?? 500).json({ message: error.message })
  }
}

export const discordConnectHandler = buildHandler('/discord/connect', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
