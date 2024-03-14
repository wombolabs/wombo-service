import { ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'
import { isNilOrEmpty } from '~/utils/isNilOrEmpty'

export const getWalletByStudentId = async (studentId) => {
  const wallet = await prisma.wallet.findFirst({ where: { ownerId: studentId } })

  if (isNilOrEmpty(wallet)) {
    throw new ResourceNotFoundError(`Wallet not found for student ${studentId}.`)
  }

  return wallet
}
