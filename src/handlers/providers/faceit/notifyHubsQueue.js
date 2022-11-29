import R from 'ramda'
import * as Sentry from '@sentry/serverless'
import { listHubsQueue } from '~/services/providers/faceit'
import { tweet } from '~/services/providers/twitter'
import { twitter as twitterConfig } from '~/config'

const handler = async () => {
  try {
    const result = await listHubsQueue()

    const msg = R.pipe(
      R.map(({ name, queue }) => {
        let text = null
        const len = queue.length
        if (len >= 4) {
          if (name.includes('Pro')) {
            text = '⚪ | Pro: X jugadores en queue'.replace('X', len)
          }
          if (name.includes('Radiant')) {
            text = '🟡 | Radiant: X jugadores en queue'.replace('X', len)
          }
          if (name.includes('High')) {
            text = '🟠 | High: X jugadores en queue'.replace('X', len)
          }
          if (name.includes('Free')) {
            text = '🔴 | Free: X jugadores en queue'.replace('X', len)
          }
        }
        return text
      }),
      R.filter(R.complement(R.isNil)),
      R.join('\n')
    )(result)

    if (!R.isEmpty(msg)) {
      const text = `${msg}\n\n#WomboProHub`
      await tweet(twitterConfig.account.wombotValorant.credentials, text)
    }
  } catch (error) {
    Sentry.captureException(error)
  }
}

export const faceItBotHubsQueueHandler = handler
