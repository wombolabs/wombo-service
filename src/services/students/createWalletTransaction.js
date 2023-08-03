import { validate as uuidValidate } from 'uuid'
import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'
import { DECREMENT_BALANCE_TRANSACTION_TYPES } from './constants'

export const createWalletTransaction = async (walletId, amount, type, description) => {
  if (!uuidValidate(walletId) || typeof amount !== 'number' || !type) {
    throw new InsufficientDataError('Wallet ID, amount and type fields are required.')
  }
  if (amount <= 0) {
    throw new InsufficientDataError('Amount value is invalid.')
  }

  let amountValue = amount

  if (DECREMENT_BALANCE_TRANSACTION_TYPES.includes(type)) {
    amountValue = -amount
  }

  const result = await prisma.walletTransaction.create({
    data: {
      amount: amountValue,
      type,
      description,
      wallet: { connect: { id: walletId } },
    },
  })

  return result
}
