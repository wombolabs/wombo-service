import R from 'ramda'
import { DEFAULT_STUDENT_WALLET_FIELDS } from '~/services/students'

const serializeTransactions = R.curry((transactions) =>
  R.map(
    R.pipe(
      R.pick(['id', 'amount', 'type', 'createdAt']),
      R.evolve({
        type: R.replace('t_', '', R.__),
      }),
    ),
  )(transactions),
)

export const serializeWalletTransactions = R.curry((wallet) =>
  R.pipe(
    R.pick([...DEFAULT_STUDENT_WALLET_FIELDS]),
    R.evolve({
      transactions: serializeTransactions,
    }),
  )(wallet),
)
