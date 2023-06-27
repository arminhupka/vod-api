import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ExposeId } from '../../../decorators/expose-id.decorator';

export class TopicResponseDto {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  summary: string;

  @ApiProperty()
  @Expose()
  order: number;
}
