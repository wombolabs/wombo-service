import R from 'ramda'
import { serializeCoach } from './serializeCoach'

export const serializeCoaches = R.curry((coaches) => R.map(serializeCoach)(coaches))
