-- DropForeignKey
ALTER TABLE "ProgressCard" DROP CONSTRAINT "ProgressCard_progressId_fkey";

-- AlterTable
ALTER TABLE "ProgressCard" ALTER COLUMN "category" SET DEFAULT 'Medium';

-- AddForeignKey
ALTER TABLE "ProgressCard" ADD CONSTRAINT "ProgressCard_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "Progress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
