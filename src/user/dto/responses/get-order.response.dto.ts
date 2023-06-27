import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { ExposeId } from '../../../decorators/expose-id.decorator';
import { OrderStatusEnum } from '../../../orders/enums/order-status.enum';

export class OrderBilling {
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
  companyName: string;

  @ApiProperty()
  @Expose()
  vatNumber: string;

  @ApiProperty()
  @Expose()
  street: string;

  @ApiProperty()
  @Expose()
  country: string;

  @ApiProperty()
  @Expose()
  city: string;

  @ApiProperty()
  @Expose()
  postCode: string;

  @ApiProperty()
  @Expose()
  companyStreet: string;

  @ApiProperty()
  @Expose()
  companyCountry: string;

  @ApiProperty()
  @Expose()
  companyPostCode: string;

  @ApiProperty()
  @Expose()
  companyPostCity: string;
}

export class ProductItem {
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

class OrderItem {
  @ApiProperty({ type: ProductItem })
  @Expose()
  @Type(() => ProductItem)
  product: ProductItem;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  tax: number;
}

export class GetOrderResponseDto {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty({ enum: OrderStatusEnum })
  @Expose()
  status: OrderStatusEnum;

  @ApiProperty()
  @Expose()
  paidAt: Date | null;

  @ApiProperty({ type: OrderBilling })
  @Expose()
  @Type(() => OrderBilling)
  billing: OrderBilling;

  @ApiProperty({ type: OrderItem, isArray: true })
  @Expose()
  @Type(() => OrderItem)
  orderItems: OrderItem[];

  @ApiProperty()
  @Expose()
  orderId: string;

  @ApiProperty()
  @Expose()
  orderNumber: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  totalTax: number;

  @ApiProperty()
  @Expose()
  totalSum: number;
}
