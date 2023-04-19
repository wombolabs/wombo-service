import R from 'ramda'
import { DEFAULT_COACH_FIELDS } from '~/services/coaches'
import { serializeTiers } from './serializeTiers'

const DEFAULT_VIDEOGAME_FIELDS = ['id', 'codename']

const serializeVideoGames = R.curry((videoGames) => R.map(R.pick([...DEFAULT_VIDEOGAME_FIELDS]))(videoGames))

export const serializeCoach = R.curry((coach) =>
  R.pipe(
    R.pick([...DEFAULT_COACH_FIELDS]),
    R.evolve({
      tiers: serializeTiers,
      videoGames: serializeVideoGames,
    })
  )(coach)
)
