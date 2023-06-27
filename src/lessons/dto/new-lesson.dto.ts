import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsString, MinLength } from 'class-validator';

export class NewLessonDto {
  @ApiProperty({ minLength: 3 })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ minLength: 16 })
  @IsString()
  @MinLength(16)
  description: string;

  @ApiProperty()
  @IsMongoId()
  course: string;

  @ApiProperty()
  @IsMongoId()
  topic: string;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty()
  @IsString()
  videoLink: string;
}
