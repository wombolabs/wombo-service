import R from 'ramda'
import { DEFAULT_VIDEOGAME_FIELDS } from '~/services/videoGames'

export const serializeVideoGames = R.curry((videoGames) => R.map(R.pick([...DEFAULT_VIDEOGAME_FIELDS]))(videoGames))
