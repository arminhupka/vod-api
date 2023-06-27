import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class NewReviewDto {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  course: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  review: string;
}
