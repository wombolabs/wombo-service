
import { jwtSign } from '~/utils/jwt'

export const generateUserToken = (user) => jwtSign(user)
