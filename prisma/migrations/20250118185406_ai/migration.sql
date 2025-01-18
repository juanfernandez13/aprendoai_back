/*
  Warnings:

  - The primary key for the `CollectionFlashcard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CollectionFlashcard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CollectionFlashcard" DROP CONSTRAINT "CollectionFlashcard_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "CollectionFlashcard_pkey" PRIMARY KEY ("collectionId", "flashcardId");
