const prisma = require('./prisma')
const { createVideoGames } = require('./scripts/videoGames')
const { createCoaches } = require('./scripts/coaches')
const { createStudentWithCredentials } = require('./scripts/students')
const { createCoupons } = require('./scripts/coupons')

async function main() {
  // Order is IMPORTANT!!!
  await createVideoGames()
  await createCoaches()

  await createStudentWithCredentials()
  await createCoupons()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
