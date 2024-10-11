import { authenticationMiddleware } from '~/middlewares'
import { serializeChatRooms } from '~/serializers'
import { listStudentChatRooms } from '~/services/students'
import { buildHandler } from '~/utils'

const handler = async ({ user, query }, res) => {
  const result = await listStudentChatRooms(user?.id, query)
  return res.json(serializeChatRooms(result))
}

export const getStudentMeChatRoomsHandler = buildHandler('/students/me/chatrooms', 'get', handler, {
  middlewares: [authenticationMiddleware],
})
