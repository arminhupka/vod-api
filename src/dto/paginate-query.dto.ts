import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginateQueryDto {
  @ApiProperty({ type: Number, minimum: 1, required: false })
  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(1)
  @IsPositive()
  @IsOptional()
  page = 1;

  @ApiProperty({ type: Number, minimum: 1, required: false })
  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(1)
  @IsPositive()
  @IsOptional()
  limit = 15;
}
