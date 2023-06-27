import { Module } from '@nestjs/common';

import { CoursesModule } from '../courses/courses.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [CoursesModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
