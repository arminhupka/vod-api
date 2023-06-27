import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { ExposeId } from '../../decorators/expose-id.decorator';
import { OrderStatusEnum } from '../enums/order-status.enum';

class OrderListItemBilling {
  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  isCompany: boolean;

  @ApiProperty()
  @Expose()
  vatNumber: string;

  @ApiProperty()
  @Expose()
  companyName: string;

  @ApiProperty()
  @Expose()
  street: string;

  @ApiProperty()
  @Expose()
  city: string;
}

export class OrderListItemUser {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty()
  @Expose()
  email: string;
}

export class OrdersListItemDto {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty()
  @Expose()
  orderId: string;

  @ApiProperty()
  @Expose()
  orderNumber: string;

  @ApiProperty({ enum: OrderStatusEnum })
  @Expose()
  status: OrderStatusEnum;

  @ApiProperty({ type: OrderListItemBilling })
  @Expose()
  @Type(() => OrderListItemBilling)
  billing: OrderListItemBilling;

  @ApiProperty()
  @Expose()
  totalTax: number;

  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  totalSum: number;

  @ApiProperty({ type: OrderListItemUser })
  @Expose()
  @Type(() => OrderListItemUser)
  user: OrderListItemUser;

  @ApiProperty()
  @Expose()
  paidAt: Date;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
