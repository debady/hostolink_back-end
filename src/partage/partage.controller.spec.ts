import { Test, TestingModule } from '@nestjs/testing';
import { PartageController } from './partage.controller';

describe('PartageController', () => {
  let controller: PartageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartageController],
    }).compile();

    controller = module.get<PartageController>(PartageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
