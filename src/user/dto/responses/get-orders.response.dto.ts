import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { ExposeId } from '../../../decorators/expose-id.decorator';
import { PaginatedResponseDto } from '../../../dto/pagination.dto';
import { OrderStatusEnum } from '../../../orders/enums/order-status.enum';

class UserOrderListItem {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty()
  @Expose()
  status: OrderStatusEnum;

  @ApiProperty()
  @Expose()
  paidAt: Date | null;

  @ApiProperty()
  @Expose()
  orderId: string;

  @ApiProperty()
  @Expose()
  orderNumber: number;

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

export class GetOrdersResponseDto extends PaginatedResponseDto {
  @ApiProperty({ isArray: true, type: UserOrderListItem })
  @Expose()
  @Type(() => UserOrderListItem)
  docs: UserOrderListItem[];
}
