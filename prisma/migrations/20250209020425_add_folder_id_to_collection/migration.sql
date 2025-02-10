/*
  Warnings:

  - You are about to drop the `_CollectionToFolder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CollectionToFolder" DROP CONSTRAINT "_CollectionToFolder_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionToFolder" DROP CONSTRAINT "_CollectionToFolder_B_fkey";

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "folderId" INTEGER;

-- DropTable
DROP TABLE "_CollectionToFolder";

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
