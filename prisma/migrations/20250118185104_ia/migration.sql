/*
  Warnings:

  - The primary key for the `CollectionFlashcard` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CollectionFlashcard" DROP CONSTRAINT "CollectionFlashcard_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "CollectionFlashcard_pkey" PRIMARY KEY ("id");
