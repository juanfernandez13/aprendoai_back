/*
  Warnings:

  - You are about to drop the column `folderId` on the `Collection` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_folderId_fkey";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "folderId",
ADD COLUMN     "resumeIsGeneratedAI" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_CollectionToFolder" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CollectionToFolder_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CollectionToFolder_B_index" ON "_CollectionToFolder"("B");

-- AddForeignKey
ALTER TABLE "_CollectionToFolder" ADD CONSTRAINT "_CollectionToFolder_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToFolder" ADD CONSTRAINT "_CollectionToFolder_B_fkey" FOREIGN KEY ("B") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
