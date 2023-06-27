import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

import { ExposeId } from '../../../decorators/expose-id.decorator';
import { PaginatedResponseDto } from '../../../dto/pagination.dto';

export class UserListItemBillingDto {
  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;
}

export class UsersListItemDto {
  @ApiProperty()
  @ExposeId()
  @Expose()
  _id: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  activated: boolean;

  @ApiProperty()
  @Expose()
  @Transform((p) => p.value.length)
  courses: number;

  @ApiProperty({ type: UserListItemBillingDto })
  @Expose()
  @Type(() => UserListItemBillingDto)
  billing: UserListItemBillingDto;

  @Expose()
  createdAt: Date;
}

export class UsersListResponse extends PaginatedResponseDto {
  @ApiProperty({ type: UsersListItemDto, isArray: true })
  @Expose()
  @Type(() => UsersListItemDto)
  docs: UsersListItemDto[];
}
