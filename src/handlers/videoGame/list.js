import { listVideoGames } from '~/services/videoGames'
import { buildHandler } from '~/utils'

const handler = async ({ query }, res) => {
  const result = await listVideoGames(query)
  return res.json(result)
}

export const listVideoGamesHandler = buildHandler('/videogames', 'get', handler)
