import { buildHandler } from '~/utils'
import { serializeStudentPublic } from '~/serializers'
import { getStudentByDiscordId } from '~/services/students'

const handler = async ({ params: { id } }, res) => {
  const result = await getStudentByDiscordId(id)
  return res.json(serializeStudentPublic(result))
}

export const getStudentByDiscordHandler = buildHandler('/students/discord/:id', 'get', handler)
