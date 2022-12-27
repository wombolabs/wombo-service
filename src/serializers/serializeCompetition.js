import R from 'ramda'
import { DEFAULT_COMPETITION_FIELDS } from '~/services/competitions'

export const serializeCompetition = R.curry((competition) => R.pick([...DEFAULT_COMPETITION_FIELDS])(competition))
