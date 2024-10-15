import { serializeCompetitions } from '~/serializers'
import { listCompetitions } from '~/services/competitions'
import { buildHandler } from '~/utils'

const handler = async ({ query }, res) => {
  const result = await listCompetitions(query)
  return res.json(serializeCompetitions(result))
}

export const listCompetitionsHandler = buildHandler('/competitions', 'get', handler)
