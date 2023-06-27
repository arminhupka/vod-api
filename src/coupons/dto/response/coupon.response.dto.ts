import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { ExposeId } from '../../../decorators/expose-id.decorator';

class CouponCourse {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  slug: string;
}

class CouponUser {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty()
  @Expose()
  email: string;
}

export class CouponResponseDto {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  used: boolean;

  @ApiProperty({ type: CouponCourse })
  @Expose()
  @Type(() => CouponCourse)
  course: CouponCourse;

  @ApiProperty({ type: CouponUser })
  @Expose()
  @Type(() => CouponUser)
  user: CouponUser;

  @ApiProperty()
  @Expose()
  courseAvailableDays: number;

  @ApiProperty()
  @Expose()
  availableUntil: Date | null;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
