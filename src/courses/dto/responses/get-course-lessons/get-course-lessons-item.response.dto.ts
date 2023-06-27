import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ExposeId } from '../../../../decorators/expose-id.decorator';

export class GetCourseLessonsItemResponseDto {
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
}
