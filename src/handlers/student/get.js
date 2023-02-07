import { buildHandler } from '~/utils'
import { serializePublicStudent } from '~/serializers'
import { getStudentByUsername } from '~/services/students'

const handler = async ({ params: { username }, query }, res) => {
  const result = await getStudentByUsername(username, query)
  return res.json(serializePublicStudent(result))
}

export const getStudentHandler = buildHandler('/students/:username', 'get', handler)
