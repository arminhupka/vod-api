import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { ExposeId } from '../../../../decorators/expose-id.decorator';
import { AdminGetCourseLessonsItemResponseDto } from '../get-course-lessons/admin-get-course-lessons-item.response.dto';

export class AdminGetCourseTopicsItemResponseDto {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  summary: string;

  @ApiProperty({ type: AdminGetCourseLessonsItemResponseDto, isArray: true })
  @Expose()
  @Type(() => AdminGetCourseLessonsItemResponseDto)
  lessons: AdminGetCourseLessonsItemResponseDto[];
}
