import { getCompetitionByCodename } from '~/services/competitions'
import { buildHandler } from '~/utils'
import { serializeCompetition } from '~/serializers'

const handler = async ({ params: { codename }, query }, res) => {
  const result = await getCompetitionByCodename(codename, query)
  return res.json(serializeCompetition(query?.withMinimalDataParticipants)(result))
}

export const getCompetitionHandler = buildHandler('/competitions/:codename', 'get', handler)
