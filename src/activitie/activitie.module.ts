import { Module } from '@nestjs/common';
import { ActivitieController } from './activitie.controller';
import { ActivitieService } from './activitie.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register(),
  ],
  controllers: [ActivitieController],
  providers: [ActivitieService]
})
export class ActivitieModule {}
