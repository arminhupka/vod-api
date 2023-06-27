import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { ExposeId } from '../../../decorators/expose-id.decorator';

class ReviewCourseDto {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty()
  @Expose()
  name: string;
}

class ReviewUserBillingDto {
  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;
}

class ReviewUserDto {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty({ type: ReviewUserBillingDto })
  @Expose()
  @Type(() => ReviewUserBillingDto)
  billing: ReviewUserBillingDto;
}

export class ReviewDto {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  review: string;

  @ApiProperty({ type: ReviewCourseDto })
  @ApiProperty()
  @Expose()
  @Type(() => ReviewCourseDto)
  course: ReviewCourseDto;

  @ApiProperty({ type: ReviewUserDto })
  @ApiProperty()
  @Expose()
  @Type(() => ReviewUserDto)
  user: ReviewUserDto;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
