-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(65) NOT NULL,
    `lastName` VARCHAR(65) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `classe` VARCHAR(100) NOT NULL,
    `filiere` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Activitie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(65) NOT NULL,
    `descrtiption` VARCHAR(191) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `creatorId` INTEGER NOT NULL,

    UNIQUE INDEX `Activitie_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActivitieParticipants` (
    `userId` INTEGER NOT NULL,
    `activitieId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `activitieId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Activitie` ADD CONSTRAINT `Activitie_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivitieParticipants` ADD CONSTRAINT `ActivitieParticipants_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivitieParticipants` ADD CONSTRAINT `ActivitieParticipants_activitieId_fkey` FOREIGN KEY (`activitieId`) REFERENCES `Activitie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
