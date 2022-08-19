import R from 'ramda'
import { DEFAULT_PRIVATE_SESSION_FIELDS } from '~/services/booking/constants'

export const serializePrivateSessions = R.curry((privateSessions) =>
  R.map(R.pick([...DEFAULT_PRIVATE_SESSION_FIELDS]))(privateSessions)
)
