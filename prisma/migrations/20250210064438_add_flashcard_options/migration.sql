/*
  Warnings:

  - Made the column `correctAnswer` on table `Flashcard` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Flashcard" ALTER COLUMN "correctAnswer" SET NOT NULL;
