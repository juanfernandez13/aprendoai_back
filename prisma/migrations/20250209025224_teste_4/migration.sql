/*
  Warnings:

  - You are about to drop the column `folderId` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `isCopyOf` on the `Collection` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_folderId_fkey";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "folderId",
DROP COLUMN "isCopyOf";

-- CreateTable
CREATE TABLE "_CollectionFolders" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CollectionFolders_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CollectionFolders_B_index" ON "_CollectionFolders"("B");

-- AddForeignKey
ALTER TABLE "_CollectionFolders" ADD CONSTRAINT "_CollectionFolders_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionFolders" ADD CONSTRAINT "_CollectionFolders_B_fkey" FOREIGN KEY ("B") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
