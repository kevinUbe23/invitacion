-- CreateTable
CREATE TABLE `Household` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(10) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `familyName` VARCHAR(191) NOT NULL,
    `maxGuests` INTEGER NOT NULL,
    `confirmedGuests` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Household_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RSVP` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `householdId` INTEGER NOT NULL,
    `count` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RSVP` ADD CONSTRAINT `RSVP_householdId_fkey` FOREIGN KEY (`householdId`) REFERENCES `Household`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
