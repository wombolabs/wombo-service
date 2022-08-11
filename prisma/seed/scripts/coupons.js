const prisma = require('../prisma')

const createCoupons = async () => {
  const today = new Date()
  const expire = new Date()
  expire.setDate(today.getDate() + 3)

  await prisma.coupon.createMany({
    data: [
      {
        id: '029837a4-3b3b-475e-a7cd-3f50655b4c55',
        name: 'wombat',
        percentOff: 10,
        maxRedemptions: 5,
        validTill: expire,
      },
      {
        id: '8f9efb13-a7f8-491a-863c-42a74d9c5ffc',
        name: 'wombito',
        percentOff: 50,
        maxRedemptions: 5,
        validTill: expire,
      },
      {
        id: 'fb088b7c-3113-47be-a53a-ddf27cae6ad9',
        name: 'wombo',
        currency: 'usd',
        amountOff: 1,
      },
    ],
  })
  console.log('Added coupons data')
}

module.exports = { createCoupons }
