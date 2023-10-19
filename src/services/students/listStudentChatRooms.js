import prisma from '~/services/prisma'

export const listStudentChatRooms = async (studentId, filters = {}) => {
  const { isActive } = filters

  const whereChatRooms = {}
  if (typeof isActive === 'boolean') {
    whereChatRooms.isActive = isActive
  }

  const result = await prisma.chatRoom.findMany({
    where: {
      ...whereChatRooms,
      members: {
        some: {
          student: {
            id: studentId,
            isActive: true,
          },
        },
      },
    },
    include: {
      members: {
        select: {
          student: {
            select: {
              id: true,
              username: true,
              metadata: true,
              stat: {
                select: {
                  rating: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  })

  return result ?? []
}
