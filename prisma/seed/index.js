const { PrismaClient } = require('@prisma/client')
const videogames = require('./data/videogames')
const coaches = require('./data/coaches')

const prisma = new PrismaClient()

async function main() {
  /*   await prisma.videoGame.deleteMany();
  console.log('Deleted records in videoGame table');

  await prisma.coach.deleteMany();
  console.log('Deleted records in coach table'); */
  await prisma.videoGame.createMany({
    data: videogames,
  })
  console.log('Added videoGames data')

  const res = await Promise.allSettled(
    coaches.map((coach) =>
      prisma.coach.upsert({
        where: { email: coach.email },
        update: {},
        create: coach,
      })
    )
  )
  console.log('Added coaches data')
  res.forEach(({ status, reason }) => {
    if (status === 'rejected') {
      console.log(reason)
    }
  })
  // Deletes references from _CoachToVideoGame
  /*   await prisma.coach.update({
    where: { id: '0ffe2d3b-2609-4426-989b-97d09a5706c5' },
    data: {
      videoGames: {
        deleteMany: {},
      },
      tiers: {
        deleteMany: {},
      },
    },
  }); */
  // await prisma.coach.delete({ where: { id: '0ffe2d3b-2609-4426-989b-97d09a5706c5' } });
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
