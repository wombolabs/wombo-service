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

export const getGroupBasicById = async (groupId) => {
  validate(groupId)

  const result = await prisma.group.findFirst({
    where: {
      id: groupId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
    },
  })

  if (!result) {
    throw new ResourceNotFoundError(`Group not found with id ${groupId}.`)
  }

  return result
}
