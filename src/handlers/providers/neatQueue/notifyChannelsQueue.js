import R from 'ramda'
import * as Sentry from '@sentry/serverless'
import { tweet } from '~/services/providers/twitter'
import { twitter as twitterConfig } from '~/config'
import { listChannelsQueue } from '~/services/providers/neatqueue'

const parser = (queue) => JSON.stringify(queue).replaceAll('"', '').replaceAll(',', '\n').slice(1, -1)

const handler = async () => {
  try {
    const result = await listChannelsQueue()

    const msg = R.pipe(
      R.map(({ name, queue, length }) => {
        let text = null
        if (length >= 6) {
          if (name.includes('High')) {
            text = `🟠 | High\n${parser(queue)}`
          }
          if (name.includes('Free')) {
            text = `🔴 | Free\n${parser(queue)}`
          }
        }
        return text
      }),
      R.filter(R.complement(R.isNil)),
      R.join('\n')
    )(result)

    if (!R.isEmpty(msg)) {
      const text = `${msg}\n\n#WomboInHouse`
      await tweet(twitterConfig.account.wombotLeagueOfLegends.credentials, text)
    }
  } catch (error) {
    Sentry.captureException(error)
  }
}

export const neatQueueBotChannelsQueueHandler = handler
