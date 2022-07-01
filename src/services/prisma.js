/* eslint-disable global-require */

const options = {
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
}

// eslint-disable-next-line import/no-mutable-exports
let prisma

if (prisma == null) {
  if (process.env.PRISMA_DATAPROXY === 'true') {
    const { PrismaClient } = require('@prisma/client/edge')
    prisma = new PrismaClient(options)
  } else {
    const { PrismaClient } = require('@prisma/client')
    prisma = new PrismaClient(options)
  }
  if (process.env.PRISMA_DATAPROXY !== 'true') {
    prisma.$on('query', ({ query, params, duration }) => {
      console.log(`Query: ${query}`)
      console.log(`Params: ${params}`)
      console.log(`Duration: ${duration}ms`)
    })
  }
}

export default prisma
