import R from 'ramda'
import { serializeChallenge } from './serializeChallenge'

export const serializeChallenges = R.curry((challenges) => R.map(serializeChallenge)(challenges))
