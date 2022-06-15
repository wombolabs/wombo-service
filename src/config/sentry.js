import { name, version } from '@/package.json'

export const sentry = {
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT,
  release: `${name}@${version}`,
  sampleRate: parseFloat(process.env.SENTRY_ERROR_RATE ?? 1),
  tracesSampleRate: parseFloat(process.env.SENTRY_TRANSACTION_RATE ?? 1),
}
