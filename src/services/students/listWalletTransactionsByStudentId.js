import { ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'

export const listWalletTransactionsByStudentId = async (studentId) => {
  const wallet = await prisma.wallet.findFirst({
    select: {
      id: true,
      balance: true,
      updatedAt: true,
      transactions: {
        select: {
          id: true,
          amount: true,
          type: true,
          description: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1000,
      },
    },
    where: { ownerId: studentId },
  })

  if (!wallet) {
    throw new ResourceNotFoundError(`Wallet not found for student ${studentId}.`)
  }

  return wallet
}
