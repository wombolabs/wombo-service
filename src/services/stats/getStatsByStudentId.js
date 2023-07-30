import prisma from '~/services/prisma'
import { InsufficientDataError } from '~/errors'
import { validate as uuidValidate } from 'uuid'

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

  const result = await prisma.stat.findFirst(query)

  return result ?? {}
}
