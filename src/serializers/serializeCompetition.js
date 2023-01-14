import R from 'ramda'
import { DEFAULT_COMPETITION_FIELDS } from '~/services/competitions'
import { DEFAULT_STUDENT_FIELDS } from '~/services/students'

const studentFields = [...DEFAULT_STUDENT_FIELDS, 'discord']

const serializeParticipantDiscord = R.curry((discord) => R.pick(['username', 'discriminator'])(discord))

const serializeParticipants = R.curry((participants) =>
  R.map(
    R.pipe(
      R.pick([...studentFields]),
      R.evolve({
        discord: serializeParticipantDiscord,
      })
    )
  )(participants)
)

const serializeMinimalDataParticipants = R.curry((participants) =>
  R.map(
    R.pipe(
      R.pick(['id', 'discord', 'metadata']),
      R.evolve({
        discord: R.curry((discord) => R.pick(['username'])(discord)),
      }),
      R.evolve({
        metadata: R.curry((metadata) => R.pick(['valorant', 'leagueOfLegends'])(metadata)),
      })
    )
  )(participants)
)

export const serializeCompetition = R.curry((withMinimalDataParticipants, competition) =>
  R.pipe(
    R.pick([...DEFAULT_COMPETITION_FIELDS]),
    R.evolve({
      participants: withMinimalDataParticipants ? serializeMinimalDataParticipants : serializeParticipants,
    })
  )(competition)
)
