import { validate as uuidValidate } from 'uuid'

import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'

export const createStudentChatRoom = async ({ studentIdFrom, studentIdTo, ...chatRoom } = {}) => {
  if (!uuidValidate(studentIdFrom) || !uuidValidate(studentIdTo)) {
    throw new InsufficientDataError('Student ID From and To fields are required.')
  }

  let result = await prisma.chatRoom.findFirst({
    where: {
      members: {
        every: {
          studentId: { in: [studentIdFrom, studentIdTo] },
        },
      },
    },
  })

  if (result == null) {
    result = await prisma.chatRoom.create({
      data: {
        ...(chatRoom ?? {}),
        members: {
          create: [{ student: { connect: { id: studentIdFrom } } }, { student: { connect: { id: studentIdTo } } }],
        },
      },
    })
  }

  return result
}
