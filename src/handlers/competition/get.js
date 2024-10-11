import { serializeCompetition } from '~/serializers'
import { getCompetitionByCodename } from '~/services/competitions'
import { buildHandler } from '~/utils'

const handler = async ({ params: { codename }, query }, res) => {
  const result = await getCompetitionByCodename(codename, query)
  return res.json(serializeCompetition(result))
}

export const getCompetitionHandler = buildHandler('/competitions/:codename', 'get', handler)
