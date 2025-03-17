import { Test, TestingModule } from '@nestjs/testing';
import { NotificationTransactionController } from './notification_transaction.controller';

describe('NotificationTransactionController', () => {
  let controller: NotificationTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationTransactionController],
    }).compile();

    controller = module.get<NotificationTransactionController>(NotificationTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
