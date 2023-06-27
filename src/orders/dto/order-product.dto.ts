import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ExposeId } from '../../decorators/expose-id.decorator';

export class OrderProductDto {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  price: number | null;

  @ApiProperty()
  @Expose()
  salePrice: number | null;

  @ApiProperty()
  @Expose()
  slug: string;
}
