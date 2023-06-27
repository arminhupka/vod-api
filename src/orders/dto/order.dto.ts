import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { ExposeId } from '../../decorators/expose-id.decorator';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { OrderBillingDto } from './order-billing.dto';
import { OrderItemDto } from './order-item.dto';
import { OrderUserDto } from './order-user.dto';

export class OrderDto {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty({ type: OrderBillingDto })
  @Expose()
  @Type(() => OrderBillingDto)
  billing: OrderBillingDto;

  @ApiProperty()
  @Expose()
  orderNumber: number;

  @ApiProperty()
  @Expose()
  orderId: string;

  @ApiProperty({ isArray: true, type: OrderItemDto })
  @Expose()
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  totalTax: number;

  @ApiProperty()
  @Expose()
  totalSum: number;

  @ApiProperty({ type: OrderUserDto })
  @Expose()
  @Type(() => OrderUserDto)
  user: OrderUserDto;

  @ApiProperty({ enum: OrderStatusEnum })
  @Expose()
  status: OrderStatusEnum;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
