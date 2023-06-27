import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class NewOrderDto {
  @ApiProperty()
  @IsArray()
  orderItems: string[];
}
