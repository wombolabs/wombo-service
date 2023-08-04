import { validate as uuidValidate } from 'uuid'
import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'
import { isNilOrEmpty } from '~/utils'
import { STUDENT_WALLET_TRANSACTION_TYPES, createStudentWallet } from '../students'
import { CHALLENGE_STATUSES } from './constants'

/**
 * Pay and enroll a challenge.
 *
 * @param {string} challengerId - The challenger ID.
 * @param {object} challengeData - The challenge data.
 *  @param {string} challengeData.id - The challenge ID.
 *  @param {number} challengeData.betAmount - The challenge bet amount.
 *  @param {number} challengeData.fee - The challenge fee.
 * @returns {Promise<object>} The updated challenge.
 */
export const txPayAndEnrollChallenge = async (challengerId, challengeData) => {
  if (!uuidValidate(challengerId) || isNilOrEmpty(challengeData)) {
    throw new InsufficientDataError('Student ID and challenge data are required.')
  }

  const { betAmount } = challengeData

  const { id: walletId, balance } = await createStudentWallet(challengerId)

  if (balance < betAmount) {
    throw new InsufficientDataError('Insufficient funds.')
  }

  const result = await prisma.$transaction([
    prisma.walletTransaction.create({
      data: {
        amount: -betAmount,
        type: STUDENT_WALLET_TRANSACTION_TYPES.ENROLL_CHALLENGE,
        description: `accept challenge ${challengeData?.id}`,
        wallet: { connect: { id: walletId } },
      },
    }),
    prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        balance: balance - betAmount,
      },
    }),
    prisma.challenge.update({
      where: { id: challengeData?.id },
      data: {
        status: CHALLENGE_STATUSES.IN_PROGRESS,
        challenger: {
          connect: { id: challengerId },
        },
      },
    }),
  ])

  return result
}
