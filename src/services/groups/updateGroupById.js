import Joi from 'joi'

import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

const validate = async (groupId, ownerId, groupData) => {
  try {
    Joi.assert(groupId, Joi.string().uuid().required(), 'group')
    Joi.assert(ownerId, Joi.string().uuid().required(), 'owner')

    await Joi.object({
      name: Joi.string().max(50),
      members: Joi.array().items(Joi.string().uuid().required()),
      categoryId: Joi.string().uuid(),
    }).validateAsync(groupData)
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      throw new InsufficientDataError(error.message)
    }
    throw error
  }
}

export const updateGroupById = async (groupId, ownerId, groupData = {}) => {
  await validate(groupId, ownerId, groupData)

  const { name, members } = groupData

  const data = {
    name,
  }

  // If there are members, connect them to the group
  if (notNilNorEmpty(members)) {
    data.members = {
      create: [],
    }
    members.forEach((memberId) => data.members.create.push({ student: { connect: { id: memberId } } }))
  }

  const result = await prisma.group.update({ where: { id: groupId }, data })

  return result
}
