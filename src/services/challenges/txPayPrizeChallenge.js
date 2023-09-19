import { validate as uuidValidate } from 'uuid'
import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'
import { STUDENT_WALLET_TRANSACTION_TYPES, getWalletByStudentId } from '../students'
import { CHALLENGE_RESULTS } from './constants'

/**
 * Pay prize pool of challenge.
 *
 * @param {string} userId The user ID.
 * @param {string} challengeId The challenge ID.
 * @param {number} feeAmount The challenge fee amount.
 * @param {number} prizeAmount The challenge prize amount.
 * @param {string} challengeResult The challenge result.
 * @returns {Promise<object>} The created challenge.
 */
export const txPayPrizeChallenge = async (userId, challengeId, betAmount, fee, challengeResult) => {
  if (!uuidValidate(userId) || !uuidValidate(challengeId)) {
    throw new InsufficientDataError('User ID and Challenge ID are required.')
  }

  const participants = challengeResult === CHALLENGE_RESULTS.DRAW ? 1 : 2 // if draw, divide prize by 2
  const feeAmount = fee > 0 ? betAmount * participants * (fee / 100) : 0
  const prizeAmount = betAmount * participants

  if (prizeAmount <= 0) {
    throw new InsufficientDataError('Prize amount is invalid.')
  }

  const wallet = await getWalletByStudentId(userId)

  const transactions = [
    prisma.walletTransaction.create({
      data: {
        amount: prizeAmount,
        type: STUDENT_WALLET_TRANSACTION_TYPES.WON_CHALLENGE,
        description: `${challengeResult} challenge ${challengeId}`,
        wallet: { connect: { id: wallet.id } },
      },
    }),
  ]

  if (feeAmount > 0) {
    transactions.push(
      prisma.walletTransaction.create({
        data: {
          amount: -feeAmount,
          type: STUDENT_WALLET_TRANSACTION_TYPES.CHALLENGE_FEE,
          description: `fee challenge ${challengeId}`,
          wallet: { connect: { id: wallet.id } },
        },
      }),
    )
  }

  const result = await prisma.$transaction([
    ...transactions,
    prisma.wallet.update({
      where: {
        id: wallet.id,
      },
      data: {
        balance: wallet.balance + (prizeAmount - feeAmount),
      },
    }),
  ])

  return result
}
