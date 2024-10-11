import { authenticationMiddleware } from '~/middlewares'
import { serializeChatRoom } from '~/serializers'
import { createStudentChatRoom } from '~/services/students'
import { buildHandler } from '~/utils'

const handler = async ({ user, body = {} }, res) => {
  const result = await createStudentChatRoom({ ...body, studentIdFrom: user?.id })
  res.json(serializeChatRoom(result))
}

export const createStudentMeChatRoomHandler = buildHandler('/students/me/chatrooms', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
