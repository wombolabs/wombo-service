import R from 'ramda'

import { serializeChatRoom } from './serializeChatRoom'

export const serializeChatRooms = R.curry((chatRooms) => R.map(serializeChatRoom)(chatRooms))
