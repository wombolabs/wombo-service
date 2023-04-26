export const DEFAULT_STUDENT_FIELDS = [
  'id',
  'email',
  'username',
  'displayName',
  'discord',
  'discordJoinDate',
  'metadata',
  'competitions',
  'wallet',
  'lastLogin',
  'createdAt',
]

export const STUDENT_WALLET_TRANSACTION_TYPES = {
  DEPOSIT: 't_deposit_',
  WITHDRAWAL: 't_withdrawal_',
  PURCHASE: 't_purchase_',
  REFUND: 't_refund_',
  FEE: 't_fee_',
}
