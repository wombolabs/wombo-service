import R from 'ramda'
import { DEFAULT_STUDENT_FIELDS } from '~/services/students'

export const serializeStudent = R.curry((student) => R.pipe(R.pick([...DEFAULT_STUDENT_FIELDS]))(student))
