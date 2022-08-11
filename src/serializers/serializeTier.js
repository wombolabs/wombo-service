import R from 'ramda'
import { DEFAULT_TIER_FIELDS } from '~/services/tiers'

export const serializeTier = R.curry((extraFields, tier) => R.pick([...DEFAULT_TIER_FIELDS, ...extraFields])(tier))
