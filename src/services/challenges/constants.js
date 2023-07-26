import R from 'ramda'

export const DEFAULT_CHALLENGE_FIELDS = [
  'id',
  'videoGame',
  'type',
  'status',
  'ranking',
  'server',
  'description',
  'metadata',
  'betAmount',
  'fee',
  'ownerScore',
  'challengerScore',
  'owner',
  'challenger',
  'competition',
  'isPublic',
  'createdAt',
  'updatedAt',
]

export const CHALLENGE_STATUSES = {
  PUBLISEHD: 'published',
  IN_PROGRESS: 'in_progress',
  AWAITING_OWNER_REPORT: 'awaiting_owner_report',
  AWAITING_CHALLENGER_REPORT: 'awaiting_challenger_report',
  FINISHED: 'finished',
  CANCELLED: 'cancelled',
  REVIEWING: 'reviewing',
}

const STATUSES_ORDER = {
  published: 7,
  in_progress: 6,
  awaiting_owner_report: 5,
  awaiting_challenger_report: 4,
  reviewing: 3,
  finished: 2,
  cancelled: 1,
}
export const statusesComparator = R.comparator((a, b) =>
  R.gt(STATUSES_ORDER[R.prop('status', a)], STATUSES_ORDER[R.prop('status', b)])
)
