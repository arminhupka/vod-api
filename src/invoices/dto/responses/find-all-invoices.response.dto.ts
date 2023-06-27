import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { ExposeId } from '../../../decorators/expose-id.decorator';
import { PaginatedResponseDto } from '../../../dto/pagination.dto';

export class InvoiceListItemOrderDto {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty()
  @Expose()
  orderId: string;
}

export class InvoiceListItemDto {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty()
  @Expose()
  invoiceNumber: number;

  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  subtotal: number;

  @ApiProperty()
  @Expose()
  tax: number;

  @ApiProperty({ type: InvoiceListItemOrderDto })
  @Expose()
  @Type(() => InvoiceListItemOrderDto)
  orderId: InvoiceListItemOrderDto;

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

export class FindAllInvoicesResponseDto extends PaginatedResponseDto {
  @ApiProperty({ type: InvoiceListItemDto, isArray: true })
  @Expose()
  @Type(() => InvoiceListItemDto)
  docs: InvoiceListItemDto[];
}
