-- AlterTable
ALTER TABLE "Subreddit" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "description" TEXT;
