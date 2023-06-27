import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { UserCourseDto } from '../user-course.dto';

export class GetUserCoursesDto {
  @ApiProperty({ type: UserCourseDto })
  @Expose()
  @Type(() => UserCourseDto)
  course: UserCourseDto;

  @ApiProperty()
  @Expose()
  availableUntil: Date;
}
