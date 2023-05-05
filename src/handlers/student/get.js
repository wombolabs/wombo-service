import { buildHandler } from '~/utils'
import { serializePublicStudent, serializeStudent } from '~/serializers'
import { getStudentByUsername } from '~/services/students'

const handler = async ({ params: { username }, query }, res) => {
  const result = await getStudentByUsername(username, query)
  return res.json(query.withWallet ? serializeStudent(result) : serializePublicStudent(result))
}

export const getStudentHandler = buildHandler('/students/:username', 'get', handler)
