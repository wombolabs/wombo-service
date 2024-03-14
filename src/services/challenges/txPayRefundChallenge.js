import { validate as uuidValidate } from 'uuid'
import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'
import { STUDENT_WALLET_TRANSACTION_TYPES, getWalletByStudentId } from '../students'

/**
 * Pay refund of challenge.
 *
 * @param {string} userId The user ID.
 * @param {string} challengeId The challenge ID.
 * @param {number} betAmount The challenge bet amount.
 * @returns {Promise<object>} The created challenge.
 */
export const txPayRefundChallenge = async (userId, challengeId, betAmount) => {
  if (!uuidValidate(userId) || !uuidValidate(challengeId)) {
    throw new InsufficientDataError('Invalid Challenge or User identification.')
  }

  const wallet = await getWalletByStudentId(userId)

  const result = await prisma.$transaction([
    prisma.walletTransaction.create({
      data: {
        amount: betAmount,
        type: STUDENT_WALLET_TRANSACTION_TYPES.REFUND,
        description: `${challengeId}`,
        wallet: { connect: { id: wallet.id } },
      },
    }),
    prisma.wallet.update({
      where: {
        id: wallet.id,
      },
      data: {
        balance: wallet.balance + betAmount,
      },
    }),
  ])

  return result
}
