import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { listStudentChatRooms } from '~/services/students'
import { serializeChatRooms } from '~/serializers'

const handler = async ({ user, query }, res) => {
  const result = await listStudentChatRooms(user?.id, query)
  return res.json(serializeChatRooms(result))
}

export const getStudentMeChatRoomsHandler = buildHandler('/students/me/chatrooms', 'get', handler, {
  middlewares: [authenticationMiddleware],
})
