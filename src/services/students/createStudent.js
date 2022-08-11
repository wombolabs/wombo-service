import prisma from '~/services/prisma'

export const createStudent = async (student) => {
  const result = await prisma.student.create({
    data: student,
  })
  return result
}
