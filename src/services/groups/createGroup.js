import Joi from 'joi'

import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

const validate = async (ownerId, groupData) => {
  try {
    Joi.assert(ownerId, Joi.string().uuid().required(), 'owner')

    await Joi.object({
      name: Joi.string().max(50).required(),
      members: Joi.array().items(Joi.string().uuid().required()),
      categoryId: Joi.string().uuid().required(),
    }).validateAsync(groupData)
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      throw new InsufficientDataError(error.message)
    }
    throw error
  }
}

export const createGroup = async (ownerId, groupData = {}) => {
  await validate(ownerId, groupData)

  const { name, members, categoryId } = groupData

  const data = {
    name,
    owner: {
      connect: { id: ownerId },
    },
    members: {
      create: [{ student: { connect: { id: ownerId } } }],
    },
    category: {
      connect: { id: categoryId },
    },
  }

  // If there are members, connect them to the group
  if (notNilNorEmpty(members)) {
    members.forEach((memberId) => data.members.create.push({ student: { connect: { id: memberId } } }))
  }

  const result = await prisma.group.create({ data })

  return result
}
