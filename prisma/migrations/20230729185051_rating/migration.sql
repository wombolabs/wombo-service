-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "accOpponentsRating" INT4 NOT NULL DEFAULT 0;
ALTER TABLE "Rating" ADD COLUMN     "highestRating" INT4 NOT NULL DEFAULT 1000;
ALTER TABLE "Rating" ADD COLUMN     "highestRatingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Rating" ADD COLUMN     "ratingDelta" INT4 NOT NULL DEFAULT 0;
