/*
  Warnings:

  - A unique constraint covering the columns `[householdId]` on the table `RSVP` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `RSVP` DROP FOREIGN KEY `RSVP_householdId_fkey`;

-- DropIndex
DROP INDEX `RSVP_householdId_fkey` ON `RSVP`;

-- AlterTable
ALTER TABLE `RSVP` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `RSVP_householdId_key` ON `RSVP`(`householdId`);

-- AddForeignKey
ALTER TABLE `RSVP` ADD CONSTRAINT `RSVP_householdId_fkey` FOREIGN KEY (`householdId`) REFERENCES `Household`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
