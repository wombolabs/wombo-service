import R from 'ramda'
import { serializeStat } from './serializeStat'

export const serializeStats = R.curry((stats) => R.map(serializeStat)(stats))
