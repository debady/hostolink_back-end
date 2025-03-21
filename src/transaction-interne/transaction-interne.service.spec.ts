import { Test, TestingModule } from '@nestjs/testing';
import { TransactionInterneService } from './transaction-interne.service';

describe('TransactionInterneService', () => {
  let service: TransactionInterneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionInterneService],
    }).compile();

    service = module.get<TransactionInterneService>(TransactionInterneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
