import { IsEnum, IsOptional, IsString } from 'class-validator';

enum OrderEnum {
  asc = 'asc',
  desc = 'desc',
}

enum OrderByEnum {
  price = 'price',
  published = 'published',
}

export class QueryDto {
  @IsString()
  @IsOptional()
  limit = '15';

  @IsString()
  @IsOptional()
  page = '1';

  @IsEnum(OrderByEnum)
  @IsOptional()
  orderBy: OrderByEnum = OrderByEnum.published;

  @IsEnum(OrderEnum)
  @IsOptional()
  order: OrderEnum = OrderEnum.asc;
}
