export { jwt } from './jwt'
export { prisma } from './prisma'
export { sentry } from './sentry'

export const isOffline = process.env.IS_OFFLINE === 'true'
export const isProduction = process.env.NODE_ENV === 'production'
export const isPrismaDataProxyEnabled = process.env.PRISMA_GENERATE_DATAPROXY === 'true'
