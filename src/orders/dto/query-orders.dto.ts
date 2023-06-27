import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryOrdersDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  limit = '15';

  @ApiProperty()
  @IsString()
  @IsOptional()
  page = '1';

  @ApiProperty()
  @IsString()
  @IsOptional()
  orderId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status?: string;
}
