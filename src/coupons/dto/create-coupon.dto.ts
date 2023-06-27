import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCouponDto {
  @ApiProperty()
  @MinLength(8)
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  course: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  courseAvailableDays?: number;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  availableUntil?: Date;
}
