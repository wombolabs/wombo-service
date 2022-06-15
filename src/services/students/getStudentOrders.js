import R from 'ramda'
import prisma from '~/services/prisma'
import { ResourceNotFoundError, InsufficientDataError } from '~/errors'

export const getStudentOrders = async (email, filters = {}) => {
  if (!email) {
    throw new InsufficientDataError()
  }

  const { type, isActive } = filters

  const whereOrders = {}
  if (!R.isEmpty(type)) {
    whereOrders.type = { in: type }
  }
  if (typeof isActive === 'boolean') {
    whereOrders.isActive = isActive
  }
  const queryOrders = {}
  if (!R.isEmpty(whereOrders)) {
    queryOrders.where = whereOrders
  }

  const result = await prisma.student
    .findFirst({
      where: {
        email,
        isActive: true,
      },
    })
    .orders(queryOrders)

  if (!result) {
    throw new ResourceNotFoundError()
  }

  return result
}
