import Joi from 'joi'

import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'

const validate = (groupId) => {
  try {
    Joi.assert(groupId, Joi.string().uuid().required(), 'group')
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      throw new InsufficientDataError(error.message)
    }
    throw error
  }
}

export const getGroupCategoryById = async (groupId, filters = {}) => {
  validate(groupId)

  const { isActive } = filters

  const result = await prisma.group.findFirst({
    where: {
      id: groupId,
      isActive: isActive ?? true,
    },
    select: {
      category: {
        select: {
          type: true,
          fee: true,
        },
      },
    },
  })

  if (!result) {
    throw new ResourceNotFoundError(`Group not found with id ${groupId}.`)
  }

  return result
}
