import { IsArray } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  products: string[];
}
