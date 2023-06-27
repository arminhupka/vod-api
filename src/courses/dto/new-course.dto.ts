import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class NewCourseDto {
  @ApiProperty({ required: true, example: 'New Awesome Course', minLength: 3 })
  @IsString()
  @MinLength(3)
  name: string;
}
