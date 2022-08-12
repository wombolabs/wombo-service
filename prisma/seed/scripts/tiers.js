const prisma = require('../prisma')
const tiers = require('../data/tiers')

const createTiers = async () => {
  await prisma.tier.createMany({
    data: tiers,
  })
  console.log('Added tiers data')
}

module.exports = { createTiers }
