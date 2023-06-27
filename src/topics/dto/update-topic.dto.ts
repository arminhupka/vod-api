import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTopicDto {
  @ApiProperty({ description: 'Topic title' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ description: 'Topic long summary' })
  @IsString()
  @IsOptional()
  summary: string;

  @ApiProperty({ description: 'Order number' })
  @IsNumber()
  @IsOptional()
  order: number;
}
