import { Module } from '@nestjs/common';

import { InvoicesModule } from '../invoices/invoices.module';
import { CronService } from './cron.service';

@Module({
  imports: [InvoicesModule],
  providers: [CronService],
})
export class CronModule {}
