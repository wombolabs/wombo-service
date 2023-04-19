import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'

prisma.$use(async (params, next) => {
  if (params.model === 'WalletTransaction' && params.action === 'create') {
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

export const addTransactionToStudentWallet = async (walletId, amount, description) => {
  if (!walletId || !amount) {
    throw new InsufficientDataError('Wallet ID  and amount field are required.')
  }

  const result = await prisma.walletTransaction.create({
    data: {
      amount,
      description,
      wallet: {
        connect: {
          id: walletId,
        },
      },
    },
  })

  return result
}
