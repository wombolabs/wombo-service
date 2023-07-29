import { buildHandler } from '~/utils'
import { getStudentByUsername } from '~/services/students'
import { getStatsByStudentId } from '~/services/stats'
import { serializeStat } from '~/serializers'

const handler = async ({ params: { username } }, res) => {
  const { id: studentId } = await getStudentByUsername(username)

  const stats = await getStatsByStudentId(studentId)

  return res.json(serializeStat(stats))
}

export const getStatsByUsernameHandler = buildHandler('/students/:username/stats', 'get', handler)
