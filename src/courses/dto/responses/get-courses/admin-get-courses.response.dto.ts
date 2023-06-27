import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { ExposeId } from '../../../../decorators/expose-id.decorator';
import { PaginatedResponseDto } from '../../../../dto/pagination.dto';
import { CourseStatusEnum } from '../../../enum/course-status.enum';

export class GetCoursesAdminItem {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  price: number | null;

  @ApiProperty()
  @Expose()
  salePrice: number | null;

  @ApiProperty()
  @Expose()
  status: CourseStatusEnum;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty()
  @Expose()
  lessonsCount: number;

  @ApiProperty()
  @Expose()
  topicsCount: number;

  @ApiProperty()
  @Expose()
  featured: boolean;

  @ApiProperty()
  @Expose()
  publishedAt: Date | null;

  @ApiProperty()
  @Expose()
  daysAvailable: number;

  @ApiProperty()
  @Expose()
  cover: string | null;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}

export class AdminGetCoursesResponseDto extends PaginatedResponseDto {
  @ApiProperty({ isArray: true, type: GetCoursesAdminItem })
  @Expose()
  @Type(() => GetCoursesAdminItem)
  docs: GetCoursesAdminItem[];
}
