const prisma = require('../prisma')
const coaches = require('../data/coaches')

const createCoaches = async () => {
  const res = await Promise.allSettled(
    coaches.map((coach) =>
      prisma.coach.upsert({
        where: { email: coach.email },
        update: {},
        create: coach,
      })
    )
  )
  res.forEach(({ status, reason }) => {
    if (status === 'rejected') {
      console.log(reason)
    }
  })
  console.log('Added coaches data')
}

const deleteCoaches = async () => {
  await prisma.coach.deleteMany()
  console.log('Deleted records in coach table')
}

const deleteCoachById = async (coachId) => {
  // Deletes references
  await prisma.coach.update({
    where: { id: coachId },
    data: {
      videoGames: {
        deleteMany: {},
      },
      tiers: {
        deleteMany: {},
      },
    },
  })
  await prisma.coach.delete({ where: { id: coachId } })
}

module.exports = { createCoaches, deleteCoaches, deleteCoachById }
