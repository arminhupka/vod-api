import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { resetInvoicesCounter } from '../utils/dbFunctions';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async resetInvoiceNumber(): Promise<void> {
    await resetInvoicesCounter();
    this.logger.log('RESET ORDERS COUNTER');
  }
}
