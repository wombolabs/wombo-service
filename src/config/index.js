export { prisma } from './prisma'
export { jwt } from './jwt'
export { sentry } from './sentry'
export { discord } from './discord'

export const isOffline = process.env.IS_OFFLINE === 'true'
export const isProduction = process.env.NODE_ENV === 'production'
export const isPrismaDataProxyEnabled = process.env.PRISMA_GENERATE_DATAPROXY === 'true'
