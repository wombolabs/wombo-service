import R from 'ramda'

export const serializeStudentPublic = R.curry((student) =>
  R.pipe(
    R.pick(['id', 'email', 'username', 'displayName', 'metadata', 'stat']),
    R.evolve({
      metadata: R.curry((metadata) => R.pick(['profile'])(metadata)),
      stat: R.curry((stat) => R.pick(['rating'])(stat)),
    }),
  )(student),
)
