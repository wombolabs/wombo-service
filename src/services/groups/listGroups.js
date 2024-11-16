import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

export const listGroups = async (groupId, studentId, filters = {}) => {
  const { isActive, isPublic, limit } = filters

  const where = {}
  if (typeof isActive === 'boolean') {
    where.isActive = isActive
  }
  if (typeof isPublic === 'boolean') {
    where.isPublic = isPublic
  }

  const query = {
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
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  }

  if (notNilNorEmpty(where)) {
    query.where = where
  }
  if (notNilNorEmpty(limit) && !Number.isNaN(parseInt(limit, 10))) {
    query.take = +limit
  }

  const result = await prisma.group.findMany(query)

  return result
}
