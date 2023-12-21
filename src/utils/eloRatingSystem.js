class EloRatingSystem {
  #DEFAULT_K_FACTOR = 40

  #SCALING_FACTOR = 600

  #DEFAULT_RATING = 1_000

  #MINIMUM_RATING = this.#DEFAULT_RATING

  #MAXIMUM_RATING = 5_000

  #MATCH_LOST = 0

  #MATCH_DRAW = 0.5

  #MATCH_WON = 1

  #expectedScore = (rating, opponentRating) => 1 / (1 + 10 ** (opponentRating - rating) / this.#SCALING_FACTOR)

  #newRating = (expectedScore, actualScore, previousRating, goalDiffIndex = 1) => {
    const diff = actualScore - expectedScore

    let rating = Math.round(previousRating + this.#DEFAULT_K_FACTOR * goalDiffIndex * diff)

    if (rating < this.#MINIMUM_RATING) {
      rating = this.#MINIMUM_RATING
    } else if (rating > this.#MAXIMUM_RATING) {
      rating = this.#MAXIMUM_RATING
    }

    return rating
  }

  newRatingIfWon = (rating, opponentRating, goalDiffIndex) =>
    this.#newRating(this.#expectedScore(rating, opponentRating), this.#MATCH_WON, rating, goalDiffIndex)

  newRatingIfLost = (rating, opponentRating, goalDiffIndex) =>
    this.#newRating(this.#expectedScore(rating, opponentRating), this.#MATCH_LOST, rating, goalDiffIndex)

  newRatingIfDraw = (rating, opponentRating) =>
    this.#newRating(this.#expectedScore(rating, opponentRating), this.#MATCH_DRAW, rating)
}

const elo = new EloRatingSystem()

const getGoalDiffIndex = (wonScore, lostScore) => {
  const diff = wonScore - lostScore
  if (diff >= 3) {
    return (11 + diff) / 8
  }
  if (diff === 2) {
    return 3 / 2
  }
  return 1
}

export { elo, getGoalDiffIndex }
