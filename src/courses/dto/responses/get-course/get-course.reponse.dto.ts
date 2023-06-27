import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ExposeId } from '../../../../decorators/expose-id.decorator';
import { CourseDifficultyLevelEnum } from '../../../enum/course-difficulty-level.enum';

export class GetCourseResponseDto {
  @ApiProperty()
  @ExposeId()
  @Expose()
  _id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  price: number | null;

  @ApiProperty()
  @Expose()
  salePrice: number | null;

  @ApiProperty()
  @Expose()
  whatYouLearn: string[];

  @ApiProperty()
  @Expose()
  courseIncludes: string[];

  @ApiProperty()
  @Expose()
  description: string | null;

  @ApiProperty()
  @Expose()
  shortDescription: string | null;

  @ApiProperty()
  @Expose()
  difficultyLevel: CourseDifficultyLevelEnum;

  @ApiProperty()
  @Expose()
  lessonsCount: number;

  @ApiProperty()
  @Expose()
  topicsCount: number;

  @ApiProperty({ nullable: true })
  @Expose()
  youtubePreview: string | null;

  @ApiProperty()
  @Expose()
  daysAvailable: number;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty()
  @Expose()
  cover: string | null;

  @ApiProperty()
  @Expose()
  featured: boolean;

  @ApiProperty()
  @Expose()
  publishedAt: Date | null;
}
