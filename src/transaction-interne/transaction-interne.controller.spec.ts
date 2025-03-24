import { Test, TestingModule } from '@nestjs/testing';
import { TransactionInterneController } from './transaction-interne.controller';

describe('TransactionInterneController', () => {
  let controller: TransactionInterneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionInterneController],
    }).compile();

    controller = module.get<TransactionInterneController>(TransactionInterneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
