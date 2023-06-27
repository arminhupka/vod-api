import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ExposeId } from '../../decorators/expose-id.decorator';

export class UserCourseDto {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  salePrice: number | null;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty()
  @Expose()
  featured: true;

  @ApiProperty()
  @Expose()
  lessonsCount: number;

  @ApiProperty()
  @Expose()
  topicsCount: number;

  @ApiProperty()
  @Expose()
  cover: string | null;
}
