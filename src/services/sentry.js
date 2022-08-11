import * as Sentry from '@sentry/serverless'
import * as SentryTracing from '@sentry/tracing'

import { sentry as sentryConfig } from '~/config'

const attachExceptionContext = (event, { originalException }) => {
  if (!originalException || !(originalException instanceof Error)) {
    return event
  }

  // eslint-disable-next-line no-param-reassign
  event.extra = { ...event.extra, Error: originalException }
  return event
}

/* <sentry> workaround for webpack's tree-shaking of required dependencies
 * @see https://github.com/getsentry/sentry-javascript/issues/2984
 */
SentryTracing.addExtensionMethods()

Sentry.AWSLambda.init({
  dsn: sentryConfig.dsn,
  environment: sentryConfig.environment,
  release: sentryConfig.release,
  integrations: [new Sentry.Integrations.Http({ tracing: true })],

  normalizeDepth: 12,
  sendDefaultPii: true,
  sampleRate: sentryConfig.sampleRate,
  tracesSampleRate: sentryConfig.tracesSampleRate,

  beforeSend: attachExceptionContext,
})

export const { wrapHandler } = Sentry.AWSLambda
