import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { CourseStatusEnum } from '../enum/course-status.enum';

export class UpdateCourseDto {
  @ApiProperty({ minLength: 3, required: false })
  @IsString()
  @MinLength(3)
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsNumber()
  @IsOptional()
  price?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @IsNumber()
  @IsOptional()
  salePrice?: number | null;

  @ApiProperty({ required: false, isArray: true, type: 'string' })
  @IsArray()
  @IsOptional()
  whatYouLearn?: string[];

  @ApiProperty({ required: false, isArray: true, type: 'string' })
  @IsArray()
  @IsOptional()
  courseIncludes?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiProperty({ enum: CourseStatusEnum, required: false })
  @IsEnum(CourseStatusEnum)
  @IsOptional()
  status?: CourseStatusEnum;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  featured: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  youtubePreview?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  daysAvailable?: number;
}
