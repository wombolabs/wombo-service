import R from 'ramda'

import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'

const processFields = R.reduce((acc, value) => {
  acc[value] = true
  return acc
}, {})

export const getCouponByName = async (name, selectFields = []) => {
  if (!name) {
    throw new InsufficientDataError('Name field is required.')
  }

  const query = {
    where: {
      name,
      isActive: true,
    },
  }

  if (!R.isEmpty(selectFields)) {
    query.select = processFields(selectFields)
  }

  const result = await prisma.coupon.findFirst(query)

  if (!result) {
    throw new ResourceNotFoundError(`Coupon not found with name ${name}.`)
  }

  return result
}
