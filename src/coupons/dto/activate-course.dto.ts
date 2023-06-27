import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ActivateCourseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}
