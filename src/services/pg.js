import { Pool } from 'pg'
import { booking } from '~/config'

// eslint-disable-next-line import/no-mutable-exports
let pool

if (pool == null) {
  pool = new Pool(booking.pg)
}

export default pool
