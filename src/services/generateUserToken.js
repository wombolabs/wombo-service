import jwt from 'jsonwebtoken'
import { jwt as jwtConfig } from '~/config'

export const generateUserToken = (user) => jwt.sign(user, jwtConfig.secret, jwtConfig.options.sign)
