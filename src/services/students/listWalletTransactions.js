import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

export const listWalletTransactions = async (filters = {}) => {
  const {
    limit, // limit of wallet transactions
  } = filters

  const query = {
    include: {
      wallet: {
        select: {
          owner: { select: { id: true, username: true } },
        },
      },
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  }
  if (notNilNorEmpty(limit) && !Number.isNaN(parseInt(limit, 10))) {
    query.take = +limit
  }

  const result = await prisma.walletTransaction.findMany(query)

  return result ?? []
}
