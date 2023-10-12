import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import { createStudentChatRoom } from '~/services/students'
import { serializeChatRoom } from '~/serializers'

const handler = async ({ user, body = {} }, res) => {
  const result = await createStudentChatRoom({ ...body, studentIdFrom: user?.id })
  res.json(serializeChatRoom(result))
}

export const createStudentMeChatRoomHandler = buildHandler('/students/me/chatrooms', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
