import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { ExposeId } from '../../../../decorators/expose-id.decorator';
import { PaginatedResponseDto } from '../../../../dto/pagination.dto';
import { CourseDifficultyLevelEnum } from '../../../enum/course-difficulty-level.enum';

class CourseListItem {
  @ApiProperty()
  @ExposeId()
  @Expose()
  _id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  shortDescription: string;

  @ApiProperty()
  @Expose()
  price: number | null;

  @ApiProperty()
  @Expose()
  salePrice: number | null;

  @ApiProperty()
  @Expose()
  difficultyLevel: CourseDifficultyLevelEnum;

  @ApiProperty()
  @Expose()
  lessonsCount: number;

  @ApiProperty()
  @Expose()
  topicsCount: number;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty()
  @Expose()
  featured: boolean;

  @ApiProperty()
  @Expose()
  daysAvailable: number;

  @ApiProperty()
  @Expose()
  cover: string | null;
}

export class GetCoursesListResponseDto extends PaginatedResponseDto {
  @ApiProperty({ isArray: true, type: CourseListItem })
  @Expose()
  @Type(() => CourseListItem)
  docs: CourseListItem[];
}
