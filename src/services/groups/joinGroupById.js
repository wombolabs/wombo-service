import Joi from 'joi'

import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'

const validate = async (groupId, studentId) => {
  try {
    Joi.assert(groupId, Joi.string().uuid().required(), 'group')
    Joi.assert(studentId, Joi.string().uuid().required(), 'owner')
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      throw new InsufficientDataError(error.message)
    }
    throw error
  }
}

export const joinGroupById = async (groupId, studentId) => {
  await validate(groupId, studentId)

  const data = {
    members: {
      create: [{ student: { connect: { id: studentId } } }],
    },
  }

  const result = await prisma.group.update({ where: { id: groupId }, data })

  return result
}
