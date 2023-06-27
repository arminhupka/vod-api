import { Test, TestingModule } from '@nestjs/testing';

import { PayuController } from './payu.controller';
import { PayuService } from './payu.service';

describe('PayuController', () => {
  let controller: PayuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayuController],
      providers: [PayuService],
    }).compile();

    controller = module.get<PayuController>(PayuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
