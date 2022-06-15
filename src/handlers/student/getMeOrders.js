import { getStudentOrders } from '~/services/students'
import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'

const handler = async ({ user, query }, res) => {
  const result = await getStudentOrders(user.email?.toLowerCase(), query)
  return res.json(result)
}

export const getStudentMeOrdersHandler = buildHandler('/students/me/orders', 'get', handler, {
  middlewares: [authenticationMiddleware],
})
