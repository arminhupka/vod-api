import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { OrderProductDto } from './order-product.dto';

export class OrderItemDto {
  @ApiProperty({ isArray: true, type: OrderProductDto })
  @Expose()
  @Type(() => OrderProductDto)
  product: OrderProductDto[];

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  tax: number;
}
