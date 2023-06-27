import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, now } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

import { UserRoleEnum } from '../users/enums/UserRoles.enum';
import { Course } from './course.schema';
import { Lesson } from './lesson.schema';

@Schema({ versionKey: false, _id: false, timestamps: false })
export class UserCourse {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Course.name,
    autopopulate: true,
  })
  course: Course;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Lesson.name,
      autopopulate: true,
    },
  ])
  watchedLessons: Lesson[];

  @Prop({ type: Date })
  availableUntil: Date;
}

@Schema({ versionKey: false, _id: false, timestamps: false })
export class Billing {
  @Prop({ type: String, default: '' })
  firstName: string;

  @Prop({ type: String, default: '' })
  lastName: string;

  @Prop({ type: Boolean, default: false })
  isCompany: boolean;

  @Prop({ type: String, default: '' })
  companyName: string;

  @Prop({ type: String, default: '' })
  vatNumber: string;

  @Prop({ type: String, default: '' })
  city: string;

  @Prop({ type: String, default: '' })
  street: string;

  @Prop({ type: String, default: '' })
  country: string;

  @Prop({ type: String, default: '' })
  postCode: string;

  @Prop({ type: String, default: '' })
  companyStreet: string;

  @Prop({ type: String, default: '' })
  companyCity: string;

  @Prop({ type: String, default: '' })
  companyCountry: string;

  @Prop({ type: String, default: '' })
  companyPostCode: string;
}

@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, default: null })
  resetPasswordToken: string | null;

  @Prop({ type: String, default: null })
  activationToken: string;

  @Prop({ type: Boolean, default: false })
  activated: boolean;

  @Prop({ type: Billing, default: new Billing() })
  billing: Billing;

  @Prop({ type: String, enum: UserRoleEnum, default: UserRoleEnum.USER })
  role: UserRoleEnum;

  @Prop([{ type: UserCourse }])
  courses: UserCourse[];

  @Prop({ type: Date, default: now() })
  createdAt: Date;

  @Prop({ type: Date, default: now() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(mongoosePaginate);
