import { forwardRef, Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { CoursesModule } from '../courses/courses.module';
import { MailModule } from '../mail/mail.module';
import { Order, OrderSchema } from '../schemas/order.schema';
import { UsersModule } from '../users/users.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   {
    //     name: Order.name,
    //     schema: OrderSchema,
    //   },
    // ]),
    MongooseModule.forFeatureAsync([
      {
        name: Order.name,
        useFactory: async (connection: Connection) => {
          const schema = OrderSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const AutoIncrement = require('mongoose-sequence')(connection);
          schema.plugin(AutoIncrement, { inc_field: 'orderNumber' });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
    forwardRef(() => CoursesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => MailModule),
    forwardRef(() => InvoicesModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
