import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CoursesModule } from '../courses/courses.module';
import { File, FileSchema } from '../schemas/file.schema';
import { Lesson, LessonSchema } from '../schemas/lesson.schema';
import { TopicsModule } from '../topics/topics.module';
import { UsersModule } from '../users/users.module';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Lesson.name,
        schema: LessonSchema,
      },
      {
        name: File.name,
        schema: FileSchema,
      },
    ]),
    forwardRef(() => CoursesModule),
    forwardRef(() => TopicsModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
