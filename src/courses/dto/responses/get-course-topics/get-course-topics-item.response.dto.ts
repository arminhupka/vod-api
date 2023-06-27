import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { ExposeId } from '../../../../decorators/expose-id.decorator';
import { GetCourseLessonsItemResponseDto } from '../get-course-lessons/get-course-lessons-item.response.dto';

export class GetCourseTopicsItemResponseDto {
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

  @ApiProperty({ type: GetCourseLessonsItemResponseDto, isArray: true })
  @Expose()
  @Type(() => GetCourseLessonsItemResponseDto)
  lessons: GetCourseLessonsItemResponseDto[];
}
