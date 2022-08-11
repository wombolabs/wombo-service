const prisma = require('../prisma')
const videogames = require('../data/videogames')

const createVideoGames = async () => {
  await prisma.videoGame.createMany({
    data: videogames,
  })
  console.log('Added videoGames data')
}

const deleteVideoGames = async () => {
  await prisma.videoGame.deleteMany()
  console.log('Deleted records in videoGame table')
}

module.exports = {
  createVideoGames,
  deleteVideoGames,
}
