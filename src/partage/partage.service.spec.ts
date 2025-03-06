import { Test, TestingModule } from '@nestjs/testing';
import { PartageService } from './partage.service';

describe('PartageService', () => {
  let service: PartageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartageService],
    }).compile();

    service = module.get<PartageService>(PartageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
