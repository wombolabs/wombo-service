import { validate as uuidValidate } from 'uuid'

import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

import { getWalletByStudentId, STUDENT_WALLET_TRANSACTION_TYPES } from '../students'
import { CHALLENGE_RESULTS, CHALLENGE_USER_TYPE } from './constants'

/**
 * Pay prize pool of challenge.
 *
 * @param {string} userType - The user type. OWNER or CHALLENGER.
 * @param {string} userId - The user ID.
 * @param {string} challengeId - The challenge ID.
 * @param {number} betAmount - The owner bet amount.
 * @param {number} challengerBetAmount - The challenger bet amount.
 * @param {number} fee - The challenge fee.
 * @param {string} challengeResult - The challenge result. WON or DRAW.
 * @returns {Promise<object>} The transaction result.
 */
export const txPayPrizeChallenge = async (
  userType, // OWNER or CHALLENGER
  userId,
  challengeId,
  betAmount, // ownerBetAmount or totalBetAmount if challengerBetAmount is null
  challengerBetAmount,
  fee,
  challengeResult,
) => {
  if (!uuidValidate(userId) || !uuidValidate(challengeId)) {
    throw new InsufficientDataError('User ID and Challenge ID are required.')
  }

  let feeAmount = 0
  let prizeAmount = 0
  if (notNilNorEmpty(challengerBetAmount) && challengerBetAmount > 0) {
    if (challengeResult === CHALLENGE_RESULTS.WON) {
      feeAmount = fee > 0 ? (betAmount + challengerBetAmount) * (fee / 100) : 0
      prizeAmount = betAmount + challengerBetAmount
    } else {
      feeAmount = fee > 0 ? (userType === CHALLENGE_USER_TYPE.OWNER ? betAmount : challengerBetAmount) * (fee / 100) : 0
      prizeAmount = userType === CHALLENGE_USER_TYPE.OWNER ? betAmount : challengerBetAmount
    }
  } else {
    const participants = challengeResult === CHALLENGE_RESULTS.DRAW ? 1 : 2 // if draw, divide prize by 2
    feeAmount = fee > 0 ? betAmount * participants * (fee / 100) : 0
    prizeAmount = betAmount * participants
  }

  if (prizeAmount <= 0) {
    throw new InsufficientDataError('Prize amount is invalid.')
  }

  const wallet = await getWalletByStudentId(userId)

  const transactions = [
    prisma.walletTransaction.create({
      data: {
        amount: prizeAmount,
        type: STUDENT_WALLET_TRANSACTION_TYPES.WON_CHALLENGE,
        description: challengeId,
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
          description: challengeId,
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
