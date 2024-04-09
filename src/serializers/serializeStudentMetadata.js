import R from 'ramda'

const serializeMetadataProfile = R.curry((profile) =>
  R.unless(
    R.isNil,
    R.pipe(
      R.pick(['availability', 'birthdate', 'cellphone', 'picture', 'socialMedias', 'geoInfo']),
      R.evolve({
        geoInfo: R.curry((geoInfo) => R.unless(R.isNil, R.pick(['countryCode']))(geoInfo)),
      }),
    ),
  )(profile),
)

export const serializeStudentMetadata = R.curry((metadata) =>
  R.unless(
    R.isNil,
    R.pipe(
      R.pick(['system', 'profile']),
      R.evolve({
        profile: serializeMetadataProfile,
      }),
    ),
  )(metadata),
)
