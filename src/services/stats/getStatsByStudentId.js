import { validate as uuidValidate } from 'uuid'

import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'

export const getStatsByStudentId = async (studentId) => {
  if (!uuidValidate(studentId)) {
    throw new InsufficientDataError('Invalid Student identification.')
  }

  const query = {
    where: { ownerId: studentId },
    include: {
      owner: {
        select: {
          username: true,
        },
      },
    },
  }

  const result = await prisma.stat.findMany(query)

  return result ?? {}
}
