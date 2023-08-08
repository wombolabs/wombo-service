import R from 'ramda'
import { DEFAULT_STUDENT_FIELDS } from '~/services/students'

const DEFAULT_COMPETITION_FIELD = 'codename'

const serializeCompetitions = R.curry((competitions) => R.pluck(DEFAULT_COMPETITION_FIELD)(competitions))

export const serializeStudent = R.curry((student) =>
  R.pipe(
    R.pick([...DEFAULT_STUDENT_FIELDS]),
    R.evolve({
      competitions: serializeCompetitions,
      wallet: R.curry((wallet) => R.unless(R.isNil, R.pick(['balance', 'updatedAt']))(wallet)),
    })
  )(student)
)
