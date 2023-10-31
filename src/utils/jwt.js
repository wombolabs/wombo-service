import jwt from 'jsonwebtoken'
import { jwt as jwtConfig } from '~/config'

export const jwtSign = (payload) =>
  new Promise((resolve, reject) => {
    jwt.sign(payload, jwtConfig.secret, jwtConfig.options.sign, (err, token) => {
      if (err) reject(err)
      resolve(token)
    })
  })

export const jwtVerify = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, jwtConfig.secret, jwtConfig.options.verify, (err, decoded) => {
      if (err) reject(err)
      resolve(decoded)
    })
  })
