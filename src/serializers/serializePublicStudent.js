import R from 'ramda'

export const serializePublicStudent = R.curry((student) =>
  R.pipe(
    R.pick(['id', 'username', 'displayName', 'discord', 'metadata']),
    R.evolve({
      discord: R.curry((discord) => R.pick(['id', 'username', 'discriminator'])(discord)),
    }),
    R.evolve({
      metadata: R.curry((metadata) => R.pick(['profile', 'videoGames', 'valorant', 'leagueOfLegends'])(metadata)),
    })
  )(student)
)
