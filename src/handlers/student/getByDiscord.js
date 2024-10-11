import { serializeStudentPublic } from '~/serializers'
import { getStudentByDiscordId } from '~/services/students'
import { buildHandler } from '~/utils'

const handler = async ({ params: { id } }, res) => {
  const result = await getStudentByDiscordId(id)
  return res.json(serializeStudentPublic(result))
}

export const getStudentByDiscordHandler = buildHandler('/students/discord/:id', 'get', handler)
