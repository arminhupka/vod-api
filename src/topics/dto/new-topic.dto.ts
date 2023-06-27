import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsString } from 'class-validator';

export class NewTopicDto {
  @ApiProperty({ description: 'Topic title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Topic long summary' })
  @IsString()
  summary: string;

  @ApiProperty({ description: 'Course ID' })
  @IsMongoId()
  course: string;

  @ApiProperty({ description: 'Order number' })
  @IsNumber()
  order: number;
}
