import { PrismaClient } from '@prisma/client'

// eslint-disable-next-line import/no-mutable-exports
let prisma

if (prisma == null) {
  prisma = new PrismaClient({
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
  })
  prisma.$on('query', ({ query, params, duration }) => {
    console.log(`Query: ${query}`)
    console.log(`Params: ${params}`)
    console.log(`Duration: ${duration}ms`)
  })
}

export default prisma
