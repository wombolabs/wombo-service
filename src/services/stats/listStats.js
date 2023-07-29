import prisma from '~/services/prisma'

export const listStats = async () => {
  const query = {
    include: {
      owner: {
        select: {
          username: true,
        },
      },
    },
    orderBy: [
      {
        rating: 'desc',
      },
    ],
  }

  const result = await prisma.stat.findMany(query)

  return result ?? []
}
