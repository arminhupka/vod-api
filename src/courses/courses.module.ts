import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LessonsModule } from '../lessons/lessons.module';
import { OrdersModule } from '../orders/orders.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { Course, CourseSchema } from '../schemas/course.schema';
import { Lesson, LessonSchema } from '../schemas/lesson.schema';
import { TopicsModule } from '../topics/topics.module';
import { UsersModule } from '../users/users.module';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Course.name,
        schema: CourseSchema,
      },
      {
        name: Lesson.name,
        schema: LessonSchema,
      },
    ]),
    forwardRef(() => LessonsModule),
    forwardRef(() => TopicsModule),
    forwardRef(() => OrdersModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ReviewsModule),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
