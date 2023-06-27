import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { PaginatedResponseDto } from '../../../dto/pagination.dto';
import { CouponResponseDto } from './coupon.response.dto';

export class CouponsListResponseDto extends PaginatedResponseDto {
  @ApiProperty({ type: CouponResponseDto, isArray: true })
  @Expose()
  @Type(() => CouponResponseDto)
  docs: CouponResponseDto[];
}
