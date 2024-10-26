import Joi from 'joi'

import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'

const validate = (groupId, studentId) => {
  try {
    Joi.assert(groupId, Joi.string().uuid().required(), 'group')
    Joi.assert(studentId, Joi.string().uuid().required(), 'student')
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      throw new InsufficientDataError(error.message)
    }
    throw error
  }
}

export const getGroupById = async (groupId, studentId, filters = {}) => {
  validate(groupId, studentId)

  const { isActive } = filters

  const result = await prisma.group.findFirst({
    where: {
      id: groupId,
      members: {
        some: {
          studentId,
        },
      },
      isActive: isActive ?? true,
    },
    include: {
      owner: {
        select: {
          id: true,
          username: true,
        },
      },
      members: {
        select: {
          student: {
            select: {
              id: true,
              username: true,
              metadata: true,
            },
          },
        },
      },
      category: {
        select: {
          id: true,
          type: true,
        },
      },
    },
  })

  if (!result) {
    throw new ResourceNotFoundError(`Group not found with id ${groupId}.`)
  }

  return result
}
