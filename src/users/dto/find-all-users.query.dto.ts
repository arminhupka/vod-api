import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginateQueryDto } from '../../dto/paginate-query.dto';

export class FindAllUsersQueryDto extends PaginateQueryDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  keyword?: string;
}
