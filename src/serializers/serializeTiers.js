import R from 'ramda'
import { DEFAULT_TIER_FIELDS } from '~/services/tiers'

export const serializeTiers = R.curry((tiers) => R.map(R.pick([...DEFAULT_TIER_FIELDS]))(tiers))
