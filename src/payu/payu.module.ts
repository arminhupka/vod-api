import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CoursesModule } from '../courses/courses.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { MailModule } from '../mail/mail.module';
import { OrdersModule } from '../orders/orders.module';
import { UsersModule } from '../users/users.module';
import { PayuController } from './payu.controller';
import { PayuService } from './payu.service';

@Module({
  imports: [
    HttpModule,
    CoursesModule,
    OrdersModule,
    UsersModule,
    MailModule,
    InvoicesModule,
  ],
  controllers: [PayuController],
  providers: [PayuService],
})
export class PayuModule {}
