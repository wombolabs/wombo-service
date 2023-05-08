import R from 'ramda'

export const serializeStudentPublic = R.curry((student) =>
  R.pipe(
    R.pick(['id', 'email', 'username', 'displayName', 'discord', 'metadata']),
    R.evolve({
      discord: R.curry((discord) => R.pick(['id', 'username', 'discriminator'])(discord)),
      metadata: R.curry((metadata) => R.pick(['profile', 'videoGames', 'valorant', 'leagueOfLegends'])(metadata)),
    })
  )(student)
)
