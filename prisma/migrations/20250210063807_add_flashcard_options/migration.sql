/*
  Warnings:

  - You are about to drop the column `answer` on the `Flashcard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Flashcard" DROP COLUMN "answer",
ADD COLUMN     "correctAnswer" TEXT,
ADD COLUMN     "options" TEXT[];
