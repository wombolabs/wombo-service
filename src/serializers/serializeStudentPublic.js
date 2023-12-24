import R from 'ramda'

export const serializeStudentPublic = R.curry((student) =>
  R.pipe(
    R.pick(['id', 'email', 'username', 'displayName', 'metadata', 'stats']),
    R.evolve({
      metadata: R.curry((metadata) => R.pick(['profile'])(metadata)),
      stats: R.curry((stats) => R.unless(R.isNil, R.map(R.pick(['rating', 'cmsVideoGameHandleId'])))(stats)),
    }),
  )(student),
)
