import prisma from '~/services/prisma'

export const getStudentByDiscordId = async (id) => {
  const result = await prisma.student.findFirst({
    where: {
      discord: {
        path: ['id'],
        string_contains: id,
      },
    },
  })

  return result
}
