import { buildHandler } from '~/utils'
import { getStudentByUsername, listStudentChallengesFinishedById } from '~/services/students'
import { serializeChallenges } from '~/serializers'

const handler = async ({ params: { username } }, res) => {
  const { id: studentId } = await getStudentByUsername(username)

  const result = await listStudentChallengesFinishedById(studentId)

  return res.json(serializeChallenges(result))
}

export const listStudentChallengesFinishedByUsernameHandler = buildHandler(
  '/students/:username/challenges',
  'get',
  handler
)
