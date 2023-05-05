/* eslint-disable global-require */

import { isOffline, isPrismaDataProxyEnabled } from '~/config'

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
    prisma = new PrismaClient(isOffline ? options.testing : options.production)
  }
  if (isOffline) {
    prisma.$on('query', ({ query, params, duration }) => {
      console.log(`Query: ${query}`)
      console.log(`Params: ${params}`)
      console.log(`Duration: ${duration}ms`)
    })
  }
}

export default prisma
