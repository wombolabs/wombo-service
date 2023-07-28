import R from 'ramda'
import { DEFAULT_RATING_FIELDS } from '~/services/ratings'

export const serializeRating = R.curry((ratings) =>
  R.pipe(
    R.pick([...DEFAULT_RATING_FIELDS]),
    R.evolve({
      owner: R.curry((owner) => owner?.username),
    })
  )(ratings)
)
