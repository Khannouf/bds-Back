-- DropIndex
DROP INDEX `Activitie_creatorId_fkey` ON `activitie`;

-- DropIndex
DROP INDEX `ActivitieParticipants_activitieId_fkey` ON `activitieparticipants`;

-- DropIndex
DROP INDEX `ImageActivitie_activitieId_fkey` ON `imageactivitie`;

-- AddForeignKey
ALTER TABLE `Activitie` ADD CONSTRAINT `Activitie_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageActivitie` ADD CONSTRAINT `ImageActivitie_activitieId_fkey` FOREIGN KEY (`activitieId`) REFERENCES `Activitie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivitieParticipants` ADD CONSTRAINT `ActivitieParticipants_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivitieParticipants` ADD CONSTRAINT `ActivitieParticipants_activitieId_fkey` FOREIGN KEY (`activitieId`) REFERENCES `Activitie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
