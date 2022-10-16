import prisma from '~/services/prisma'
import R from 'ramda'

export const listStudentsHighSchoolEnrolled = async () => {
  const result = await prisma.$queryRaw`
    SELECT s.* FROM "Student" s WHERE s.metadata->>'leagueHighSchoolEnrolled' = 'true'`
  return !R.isEmpty(result) ? result : []
}
