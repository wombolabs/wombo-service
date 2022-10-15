import prisma from '~/services/prisma'
import R from 'ramda'

export const listStudentsHubEnrolled = async () => {
  const result = await prisma.$queryRaw`
    SELECT s.* FROM "Student" s WHERE s.metadata->>'leagueHubEnrolled' = 'true'`
  return !R.isEmpty(result) ? result : []
}
