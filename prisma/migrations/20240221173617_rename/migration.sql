/*
  Warnings:

  - You are about to drop the column `descrtiption` on the `activitie` table. All the data in the column will be lost.
  - Added the required column `description` to the `Activitie` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Activitie_creatorId_fkey` ON `activitie`;

-- DropIndex
DROP INDEX `ActivitieParticipants_activitieId_fkey` ON `activitieparticipants`;

-- AlterTable
ALTER TABLE `activitie` DROP COLUMN `descrtiption`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Activitie` ADD CONSTRAINT `Activitie_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivitieParticipants` ADD CONSTRAINT `ActivitieParticipants_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivitieParticipants` ADD CONSTRAINT `ActivitieParticipants_activitieId_fkey` FOREIGN KEY (`activitieId`) REFERENCES `Activitie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
