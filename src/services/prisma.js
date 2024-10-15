/* eslint-disable global-require */
import { isOffline, isPrismaDataProxyEnabled, isProduction, prisma as prismaConfig } from '~/config'

// eslint-disable-next-line import/no-mutable-exports
let prisma

if (prisma == null) {
  if (isPrismaDataProxyEnabled) {
    const { PrismaClient } = require('@prisma/client/edge')
    prisma = new PrismaClient()
  } else {
    const { PrismaClient } = require('@prisma/client')
    prisma = new PrismaClient(isProduction ? prismaConfig.options.production : prismaConfig.options.testing)
  }
  if (isOffline) {
    prisma.$on('query', ({ query, params, duration }) => {
      console.log(`Query: ${query}\nParams: ${params}\nDuration: ${duration}ms`)
    })
  }

  prisma.$use(async (params, next) => {
    if (params?.model === 'WalletTransaction' && params?.action === 'create' && !params?.runInTransaction) {
      const wallet = await prisma.wallet.findFirst({
        where: {
          id: params.args.data.wallet.connect.id,
        },
        select: {
          id: true,
          balance: true,
        },
      })

      const newBalance = wallet.balance + params.args.data.amount

      await prisma.wallet.update({
        where: {
          id: wallet.id,
        },
        data: {
          balance: newBalance,
        },
      })
    }

    return next(params)
  })
}

export default prisma
