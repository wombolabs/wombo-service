/* eslint-disable global-require */
import { isOffline, isPrismaDataProxyEnabled, isProduction } from '~/config'

const options = {
  testing: {
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ],
  },
  production: {
    log: [
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ],
  },
}

// eslint-disable-next-line import/no-mutable-exports
let prisma

if (prisma == null) {
  if (isPrismaDataProxyEnabled) {
    const { PrismaClient } = require('@prisma/client/edge')
    prisma = new PrismaClient()
  } else {
    const { PrismaClient } = require('@prisma/client')
    prisma = new PrismaClient(isProduction ? options.production : options.testing)
  }
  if (isOffline) {
    prisma.$on('query', ({ query, params, duration }) => {
      console.log(`Query: ${query}\nParams: ${params}\nDuration: ${duration}ms`)
    })
  }
}

export default prisma
