import prisma from '~/services/prisma'
import R from 'ramda'

export const listStudentsHubLoLEnrolled = async () => {
  const result = await prisma.$queryRaw`
    SELECT s.* FROM "Student" s WHERE s.metadata->>'leagueHubLoLEnrolled' = 'true'`
  return !R.isEmpty(result) ? result : []
}
