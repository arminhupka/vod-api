import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ExposeId } from '../../../decorators/expose-id.decorator';

export class UserCourseLessonDto {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty({ isArray: true })
  @Expose()
  attachments: any[];

  @ApiProperty()
  @Expose()
  order: number;

  @ApiProperty()
  @Expose()
  videoLink: string;

  @ApiProperty()
  @Expose()
  hasAttachments: boolean;
}
