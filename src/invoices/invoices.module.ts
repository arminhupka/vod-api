import { forwardRef, Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { OrdersModule } from '../orders/orders.module';
import { Invoice, InvoiceSchema } from '../schemas/invoice.schema';
import { UsersModule } from '../users/users.module';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => OrdersModule),
    MongooseModule.forFeatureAsync([
      {
        name: Invoice.name,
        useFactory: async (connection: Connection) => {
          const schema = InvoiceSchema;
          const AutoIncrement = require('mongoose-sequence')(connection);
          schema.plugin(AutoIncrement, { inc_field: 'invoiceNumber' });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
