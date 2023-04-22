import { STUDENT_WALLET_TRANSACTION_TYPES, createStudentWallet, createWalletTransaction } from '~/services/students'
import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { InsufficientDataError } from '~/errors'

const handler = async ({ user, body }, res) => {
  const { amount, type, description } = body

  if (amount == null || !type) {
    throw new InsufficientDataError('Amount and type fields are required.')
  }
  if (!(amount >= 0)) {
    throw new InsufficientDataError('Amount field is invalid.')
  }

  const { id: walletId, balance } = await createStudentWallet(user?.id)

  if (type === STUDENT_WALLET_TRANSACTION_TYPES.PURCHASE && balance < amount) {
    throw new InsufficientDataError('Insufficient funds.')
  }

  await createWalletTransaction(walletId, amount, type, description)

  return res.json({ processed: true })
}

export const createWalletTransactionHandler = buildHandler('/students/me/transactions', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
