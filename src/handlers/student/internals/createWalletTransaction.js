import {
  STUDENT_WALLET_TRANSACTION_TYPES,
  createStudentWallet,
  createWalletTransaction,
  getStudentByUsername,
} from '~/services/students'
import { buildHandler, notNilNorEmpty } from '~/utils'
import { authenticationInternalMiddleware } from '~/middlewares'
import { InsufficientDataError } from '~/errors'

const handler = async ({ params: { username }, body }, res) => {
  const { amount, type, description } = body

  if (amount == null || !type) {
    throw new InsufficientDataError('Amount and type fields are required.')
  }
  if (amount <= 0) {
    throw new InsufficientDataError('Amount field is invalid.')
  }

  const student = await getStudentByUsername(username)

  const { id: walletId, balance } = await createStudentWallet(student?.id)

  if (type === STUDENT_WALLET_TRANSACTION_TYPES.PURCHASE && balance < amount) {
    throw new InsufficientDataError('Insufficient funds.')
  }

  const transaction = await createWalletTransaction(walletId, amount, type, description)

  return res.json({ processed: notNilNorEmpty(transaction) })
}

export const createWalletTransactionInternalHandler = buildHandler(
  '/students/internals/:username/transactions',
  'post',
  handler,
  {
    middlewares: [authenticationInternalMiddleware],
  }
)
