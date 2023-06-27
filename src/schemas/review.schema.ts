import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { Course } from './course.schema';
import { User } from './user.schema';

@Schema({ versionKey: false, timestamps: true })
export class Review extends Document {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  review: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    autopopulate: true,
  })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Course.name,
    autopopulate: true,
  })
  course: Course;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
