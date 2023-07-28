import prisma from '~/services/prisma'

export const listRatings = async () => {
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

  const result = await prisma.rating.findMany(query)

  return result ?? []
}
