import prisma from '~/services/prisma'

export const listWalletTransactions = async () => {
  const transactions = await prisma.walletTransaction.findMany({
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
  })
  return transactions
}
