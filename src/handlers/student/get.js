import { buildHandler } from '~/utils'
import { serializeStudentPublic } from '~/serializers'
import { getStudentByUsername } from '~/services/students'

const handler = async ({ params: { username }, query }, res) => {
  const result = await getStudentByUsername(username, query)
  return res.json(serializeStudentPublic(result))
}

export const getStudentHandler = buildHandler('/students/:username', 'get', handler)
