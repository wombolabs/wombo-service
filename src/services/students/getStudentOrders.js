import R from 'ramda'

import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'

export const getStudentOrders = async (email, filters = {}) => {
  if (!email) {
    throw new InsufficientDataError('Email field is required.')
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

  return result
}
