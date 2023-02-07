import R from 'ramda'

export const serializePublicStudent = R.curry((student) =>
  R.pipe(
    R.pick(['id', 'username', 'displayName', 'discord', 'metadata']),
    R.evolve({
      discord: R.curry((discord) => R.pick(['username', 'discriminator'])(discord)),
    }),
    R.evolve({
      metadata: R.curry((metadata) => R.pick(['profile', 'valorant', 'leagueOfLegends'])(metadata)),
    })
  )(student)
)
