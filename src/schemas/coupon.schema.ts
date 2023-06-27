import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

import { Course } from './course.schema';
import { User } from './user.schema';

@Schema({ versionKey: false, timestamps: true, virtuals: true })
export class Coupon extends Document {
  @Prop({ type: String })
  code: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Course.name,
    autopopulate: true,
  })
  course: Course;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    default: null,
    autopopulate: true,
  })
  user: User | null;

  @Prop({ type: Number, default: null })
  courseAvailableDays: number | null;

  @Prop({ type: Date, default: null })
  availableUntil: Date | null;

  @Prop({ type: Boolean, default: false })
  used: boolean;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

CouponSchema.plugin(mongoosePaginate);
