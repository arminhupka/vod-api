import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

import { OrderStatusEnum } from '../orders/enums/order-status.enum';
import { Course } from './course.schema';
import { Billing, User } from './user.schema';

@Schema({ versionKey: false, _id: false, timestamps: false })
export class OrderItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    autopopulate: true,
  })
  product: Course;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: Number })
  tax: number;
}

@Schema({
  versionKey: false,
  id: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class Order extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    autopopulate: true,
  })
  user: User;

  @Prop({ type: Billing, default: () => new Billing() })
  billing: Billing;

  @Prop([{ type: OrderItem }])
  orderItems: OrderItem[];

  @Prop({ type: String, enum: OrderStatusEnum, default: OrderStatusEnum.NEW })
  status: OrderStatusEnum;

  @Prop({ type: Number, default: 1, unique: true })
  orderNumber: number;

  @Prop({ type: String })
  orderId: string;

  @Prop({ type: String, default: '' })
  stripePaymentIntent: string;

  @Prop({ type: Number, default: 23 })
  tax_rate: number;

  @Prop({ type: Date, default: null })
  paidAt: Date | null;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.plugin(mongoosePaginate);

OrderSchema.virtual('email').get(function (this: Order) {
  return this.user.email;
});

OrderSchema.virtual('total').get(function (this: Order) {
  return this.orderItems.length
    ? this.orderItems
        .map((oi) => oi.price)
        .reduce((prev, current) => {
          prev = prev + current;
          return prev;
        })
    : 0;
});

OrderSchema.virtual('totalTax').get(function (this: Order) {
  return this.orderItems.length
    ? this.orderItems
        .map((oi) => oi.tax)
        .reduce((prev, current) => {
          prev = prev + current;
          return prev;
        })
    : 0;
});

OrderSchema.virtual('totalSum').get(function (this: Order) {
  const tax = this.orderItems.length
    ? this.orderItems
        .map((oi) => oi.tax)
        .reduce((prev, current) => {
          prev = prev + current;
          return prev;
        })
    : 0;

  const total = this.orderItems.length
    ? this.orderItems
        .map((oi) => oi.price)
        .reduce((prev, current) => {
          prev = prev + current;
          return prev;
        })
    : 0;

  return total + tax;
});
