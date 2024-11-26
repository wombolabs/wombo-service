import R from 'ramda'

import { serializeGroup } from './serializeGroup'

export const serializeGroups = R.curry((groups) => R.map(serializeGroup)(groups))
