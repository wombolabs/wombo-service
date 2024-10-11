import { authenticationMiddleware } from '~/middlewares'
import { serializeWalletTransactions } from '~/serializers'
import { listWalletTransactionsByStudentId } from '~/services/students'
import { buildHandler } from '~/utils'

const handler = async ({ user, query }, res) => {
  const result = await listWalletTransactionsByStudentId(user.id, query)
  return res.json(serializeWalletTransactions(result))
}

export const listStudentMeWalletTransactionsHandler = buildHandler('/students/me/transactions', 'get', handler, {
  middlewares: [authenticationMiddleware],
})
