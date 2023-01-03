import R from 'ramda'
import { DEFAULT_COMPETITION_FIELDS } from '~/services/competitions'
import { DEFAULT_STUDENT_FIELDS } from '~/services/students'

const studentFields = [...DEFAULT_STUDENT_FIELDS, 'discord']

const serializeParticipants = R.curry((participants) => R.map(R.pick([...studentFields]))(participants))

export const serializeCompetition = R.curry((competition) =>
  R.pipe(
    R.pick([...DEFAULT_COMPETITION_FIELDS]),
    R.evolve({
      participants: serializeParticipants,
    })
  )(competition)
)
