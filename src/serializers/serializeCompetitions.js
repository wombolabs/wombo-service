import R from 'ramda'

import { serializeCompetition } from './serializeCompetition'

export const serializeCompetitions = R.curry((competitions) => R.map(serializeCompetition)(competitions))
