import { listCompetitions } from '~/services/competitions'
import { buildHandler } from '~/utils'
import { serializeCompetitions } from '~/serializers'

const handler = async ({ query }, res) => {
  const result = await listCompetitions(query)
  return res.json(serializeCompetitions(result))
}

export const listCompetitionsHandler = buildHandler('/competitions', 'get', handler)
