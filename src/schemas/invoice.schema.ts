import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

import { Order } from './order.schema';
import { Billing, User } from './user.schema';

@Schema({ timestamps: false, versionKey: false })
export class Invoice extends Document {
  @Prop({ type: Number, unique: true, default: 1 })
  invoiceNumber: number;

  @Prop({ type: User, ref: User.name, autopopulate: true })
  user: User;

  @Prop({ type: Number })
  total: number;

  @Prop({ type: Number })
  subtotal: number;

  @Prop({ type: Number })
  tax: number;

  @Prop({ type: Billing, default: () => new Billing() })
  billing: Billing;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Order.name,
    autopopulate: true,
  })
  orderId: Order;

  @Prop({ type: Date })
  paidAt: Date;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

InvoiceSchema.plugin(mongoosePaginate);
