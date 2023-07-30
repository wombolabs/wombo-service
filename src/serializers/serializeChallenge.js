import R from 'ramda'
import { DEFAULT_CHALLENGE_FIELDS } from '~/services/challenges'

const serializeStudent = R.curry((student) =>
  R.unless(
    R.isNil,
    R.pipe(
      R.pick(['id', 'username', 'metadata', 'stat']),
      R.evolve({
        metadata: R.curry((metadata) =>
          R.pipe(
            R.pick(['profile']),
            R.evolve({
              profile: R.curry((profile) => R.pick(['picture', 'country'])(profile)),
            })
          )(metadata)
        ),
      })
    )
  )(student)
)

export const serializeChallenge = R.curry((challenge) =>
  R.pipe(
    R.pick([...DEFAULT_CHALLENGE_FIELDS]),
    R.evolve({
      owner: serializeStudent,
      challenger: serializeStudent,
    })
  )(challenge)
)
