import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { Course } from './course.schema';
import { File } from './file.schema';
import { Topic } from './topic.schema';

@Schema({
  versionKey: false,
  timestamps: true,
  id: false,
  toJSON: { virtuals: true },
})
export class Lesson extends Document {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    autopopulate: true,
  })
  course: Course;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Topic.name,
    autopopulate: true,
  })
  topic: Topic;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: File.name,
      autopopulate: true,
    },
  ])
  attachments: File[];

  @Prop({ type: Number, required: true })
  order: number;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: String, default: '' })
  videoLink: string;

  hasAttachments: boolean;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

LessonSchema.virtual('hasAttachments').get(function (this: Lesson) {
  return !!this.attachments.length;
});
