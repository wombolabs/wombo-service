import { serializeChallenges } from '~/serializers'
import { getStudentByUsername, listStudentChallengesFinishedById } from '~/services/students'
import { buildHandler } from '~/utils'

const handler = async ({ params: { username }, query }, res) => {
  const { id: studentId } = await getStudentByUsername(username)

  const result = await listStudentChallengesFinishedById(studentId, query)

  return res.json(serializeChallenges(result))
}

export const listStudentChallengesFinishedByUsernameHandler = buildHandler(
  '/students/:username/challenges/finished',
  'get',
  handler,
)
