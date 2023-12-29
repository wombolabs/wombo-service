import { buildHandler } from '~/utils'
import { getStudentByUsername } from '~/services/students'
import { getStatsByStudentId } from '~/services/stats'
import { serializeStats } from '~/serializers'

const handler = async ({ params: { username } }, res) => {
  const { id: studentId } = await getStudentByUsername(username)

  const result = await getStatsByStudentId(studentId)

  return res.json(serializeStats(result))
}

export const getStatsByUsernameHandler = buildHandler('/students/:username/stats', 'get', handler)
