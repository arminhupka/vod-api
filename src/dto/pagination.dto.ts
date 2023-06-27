import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PaginatedResponseDto {
  @ApiProperty()
  @Expose()
  totalDocs: number;

  @ApiProperty()
  @Expose()
  limit: number;

  @ApiProperty()
  @Expose()
  totalPages: number;

  @ApiProperty()
  @Expose()
  page: number;

  @ApiProperty()
  @Expose()
  pagingCounter: number;

  @ApiProperty()
  @Expose()
  hasPrevPage: boolean;

  @ApiProperty()
  @Expose()
  hasNextPage: boolean;

  @ApiProperty()
  @Expose()
  prevPage: boolean;

  @ApiProperty()
  @Expose()
  nextPage: boolean;
}
