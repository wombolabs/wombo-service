import prisma from '~/services/prisma'

export const createStudentWallet = async (studentId) => {
  let result = await prisma.wallet.findFirst({ where: { ownerId: studentId } })

  if (result == null) {
    result = await prisma.wallet.create({
      data: {
        balance: 0,
        owner: { connect: { id: studentId } },
      },
    })
  }

  return result
}
