import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { PaginatedResponseDto } from '../../../dto/pagination.dto';
import { OrdersListItemDto } from '../orders-list-item.dto';

export class GetAdminOrdersResponseDto extends PaginatedResponseDto {
  @ApiProperty({ type: OrdersListItemDto, isArray: true })
  @Expose()
  @Type(() => OrdersListItemDto)
  docs: OrdersListItemDto[];
}
