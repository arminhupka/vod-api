import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { Course } from './course.schema';
import { Lesson } from './lesson.schema';

@Schema({ timestamps: false, versionKey: false })
export class Topic extends Document {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  summary: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    autopopulate: true,
  })
  course: Course;

  @Prop([
    { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', autopopulate: true },
  ])
  lessons: Lesson[];

  @Prop({ type: Number, required: true })
  order: number;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
