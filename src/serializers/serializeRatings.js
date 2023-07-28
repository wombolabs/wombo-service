import R from 'ramda'
import { serializeRating } from './serializeRating'

export const serializeRatings = R.curry((ratings) => R.map(serializeRating)(ratings))
