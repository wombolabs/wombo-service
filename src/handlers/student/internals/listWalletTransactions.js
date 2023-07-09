import { buildHandler } from '~/utils'
import { authenticationInternalMiddleware } from '~/middlewares'
import { listWalletTransactions } from '~/services/students/listWalletTransactions'

const handler = async (req, res) => {
  const transactions = await listWalletTransactions()
  return res.json(transactions)
}

export const listWalletTransactionsInternalHandler = buildHandler('/students/internals/transactions', 'get', handler, {
  middlewares: [authenticationInternalMiddleware],
})
