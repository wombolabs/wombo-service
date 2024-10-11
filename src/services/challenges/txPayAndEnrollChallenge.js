import { validate as uuidValidate } from 'uuid'

import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'
import { isNilOrEmpty, notNilNorEmpty } from '~/utils'

import { createStudentWallet, STUDENT_WALLET_TRANSACTION_TYPES } from '../students'
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

  const { betAmount = 0, challengerBetAmount } = challengeData

  const { id: walletId, balance } = await createStudentWallet(challengerId)

  if (notNilNorEmpty(challengerBetAmount) && balance < challengerBetAmount) {
    throw new InsufficientDataError('Insufficient funds.')
  }

  if (balance < betAmount) {
    throw new InsufficientDataError('Insufficient funds.')
  }

  const result = await prisma.$transaction([
    prisma.walletTransaction.create({
      data: {
        amount: notNilNorEmpty(challengerBetAmount) ? -challengerBetAmount : -betAmount,
        type: STUDENT_WALLET_TRANSACTION_TYPES.ENROLL_CHALLENGE,
        description: challengeData?.id,
        wallet: { connect: { id: walletId } },
      },
    }),
    prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        balance: balance - (notNilNorEmpty(challengerBetAmount) ? challengerBetAmount : betAmount),
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
