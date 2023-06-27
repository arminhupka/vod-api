import { Module } from '@nestjs/common';

import { CoursesModule } from '../courses/courses.module';
import { TopicsModule } from '../topics/topics.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [CoursesModule, TopicsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
