import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ExposeId } from '../../../decorators/expose-id.decorator';
import { CourseStatusEnum } from '../../enum/course-status.enum';

export class CourseResponseDto {
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
  whatYouLearn: string[];

  @ApiProperty()
  @Expose()
  courseIncludes: string[];

  @ApiProperty()
  @Expose()
  description: string | null;

  @ApiProperty()
  @Expose()
  shortDescription: string | null;

  @ApiProperty()
  @Expose()
  status: CourseStatusEnum;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty()
  @Expose()
  publishedAt: Date | null;

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
