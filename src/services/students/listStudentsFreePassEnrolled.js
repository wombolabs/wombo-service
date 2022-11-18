import prisma from '~/services/prisma'
import R from 'ramda'

export const listStudentsFreePassEnrolled = async () => {
  const result = await prisma.$queryRaw`
    SELECT s.* FROM "Student" s WHERE s.metadata->>'freeWomboPass' = 'true'`
  return !R.isEmpty(result) ? result : []
}
