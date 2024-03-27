import { Test, TestingModule } from '@nestjs/testing';
import { ActivitieService } from './activitie.service';

describe('ActivitieService', () => {
  let service: ActivitieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivitieService],
    }).compile();

    service = module.get<ActivitieService>(ActivitieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
