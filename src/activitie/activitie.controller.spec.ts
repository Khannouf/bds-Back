import { Test, TestingModule } from '@nestjs/testing';
import { ActivitieController } from './activitie.controller';

describe('ActivitieController', () => {
  let controller: ActivitieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitieController],
    }).compile();

    controller = module.get<ActivitieController>(ActivitieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
