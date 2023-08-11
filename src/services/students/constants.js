export const DEFAULT_STUDENT_FIELDS = [
  'id',
  'email',
  'username',
  'displayName',
  'metadata',
  'competitions',
  'wallet',
  'lastLogin',
  'createdAt',
  'updatedAt',
]

export const STUDENT_WALLET_TRANSACTION_TYPES = {
  DEPOSIT: 't_deposit_',
  WITHDRAWAL: 't_withdrawal_',
  PURCHASE: 't_purchase_',
  REFUND: 't_refund_',
  FEE: 't_fee_',
  ENROLL_COMPETITION: 't_enroll_competition_',
  WON_COMPETITION: 't_won_competition_',
  CREATE_CHALLENGE: 't_create_challenge_',
  ENROLL_CHALLENGE: 't_enroll_challenge_',
  WON_CHALLENGE: 't_won_challenge_',
  REFERRAL: 't_referral_',
  PRIZE: 't_prize_',
}

export const DECREMENT_BALANCE_TRANSACTION_TYPES = [
  STUDENT_WALLET_TRANSACTION_TYPES.PURCHASE,
  STUDENT_WALLET_TRANSACTION_TYPES.ENROLL_COMPETITION,
  STUDENT_WALLET_TRANSACTION_TYPES.CREATE_CHALLENGE,
  STUDENT_WALLET_TRANSACTION_TYPES.ENROLL_CHALLENGE,
  STUDENT_WALLET_TRANSACTION_TYPES.WITHDRAWAL,
  STUDENT_WALLET_TRANSACTION_TYPES.FEE,
]
