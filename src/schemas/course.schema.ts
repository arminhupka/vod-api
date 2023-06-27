import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { NextFunction } from 'express';
import { Document, now } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import slugify from 'slugify';

import { CourseDifficultyLevelEnum } from '../courses/enum/course-difficulty-level.enum';
import { CourseStatusEnum } from '../courses/enum/course-status.enum';
import { Lesson } from './lesson.schema';
import { Topic } from './topic.schema';

@Schema({
  versionKey: false,
  timestamps: true,
  id: false,
  toJSON: { virtuals: true },
})
export class Course extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: Number, required: null, default: null })
  price: number | null;

  @Prop({ type: Number, required: null, default: null })
  salePrice: number | null;

  @Prop([{ type: String }])
  whatYouLearn: string[];

  @Prop([{ type: String }])
  courseIncludes: string[];

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: String, default: '' })
  shortDescription: string;

  @Prop({ type: Boolean, default: false })
  featured: boolean;

  @Prop({
    type: String,
    enum: CourseDifficultyLevelEnum,
    default: CourseDifficultyLevelEnum.BEGINNER,
  })
  difficultyLevel: CourseDifficultyLevelEnum;

  @Prop({ type: Number, default: 30 })
  daysAvailable: number;

  @Prop({
    type: String,
    enum: CourseStatusEnum,
    required: true,
    default: CourseStatusEnum.DRAFT,
  })
  status: CourseStatusEnum;

  @Prop({
    type: String,
    required: true,
  })
  slug: string;

  @Prop({ type: Date, default: null })
  publishedAt: Date | null;

  @Prop({ type: Date, default: now() })
  createdAt: Date;

  @Prop({ type: Date, default: now() })
  updatedAt: Date;

  @Prop({ type: String, default: null })
  youtubePreview: string | null;

  @Prop({ type: String, default: null })
  cover: string | null;

  @Type(() => Lesson)
  lessons: Lesson[];

  @Type(() => Topic)
  topics: Topic[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.plugin(mongoosePaginate);

CourseSchema.virtual('lessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'course',
});

CourseSchema.virtual<Course>('lessonsCount').get(function (this) {
  return this.lessons ? this.lessons.length : 0;
});

CourseSchema.virtual('topics', {
  ref: Topic.name,
  localField: '_id',
  foreignField: 'course',
});

CourseSchema.virtual<Course>('topicsCount').get(function (this) {
  return this.topics ? this.topics.length : 0;
});

CourseSchema.pre<Course>('validate', function (next: NextFunction) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
