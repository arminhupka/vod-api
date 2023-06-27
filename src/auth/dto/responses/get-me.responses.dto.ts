import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { ExposeId } from '../../../decorators/expose-id.decorator';
import { UserRoleEnum } from '../../../users/enums/UserRoles.enum';

class SimplyBillingResponseDto {
  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  isCompany: boolean;

  @ApiProperty()
  @Expose()
  companyName: string;

  @ApiProperty()
  @Expose()
  vatNumber: string;

  @ApiProperty()
  @Expose()
  street: string;

  @ApiProperty()
  @Expose()
  city: string;

  @ApiProperty()
  @Expose()
  country: string;

  @ApiProperty()
  @Expose()
  postCode: string;

  @ApiProperty()
  @Expose()
  companyStreet: string;

  @ApiProperty()
  @Expose()
  companyCountry: string;

  @ApiProperty()
  @Expose()
  companyPostCode: string;

  @ApiProperty()
  @Expose()
  companyCity: string;
}

class UserCoursesCourse {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;
}

class SimplyUserLesson {
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

class SimplyUserCurses {
  @ApiProperty({ type: UserCoursesCourse })
  @Expose()
  @Type(() => UserCoursesCourse)
  course: UserCoursesCourse;

  @ApiProperty({ type: SimplyUserLesson, isArray: true })
  @Expose()
  @Type(() => SimplyUserLesson)
  watchedLessons: SimplyUserLesson[];

  @ApiProperty()
  @Expose()
  availableUntil: Date;
}

export class GetMeResponsesDto {
  @ApiProperty()
  @Expose()
  @ExposeId()
  _id: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty({ type: SimplyBillingResponseDto })
  @Expose()
  @Type(() => SimplyBillingResponseDto)
  billing: SimplyBillingResponseDto;

  @ApiProperty({ isArray: true, type: String })
  @Expose()
  watchedLessons: string[];

  @ApiProperty({ type: SimplyUserCurses, isArray: true })
  @Expose()
  @Type(() => SimplyUserCurses)
  courses: SimplyUserCurses[];

  @ApiProperty({ type: UserRoleEnum, enum: UserRoleEnum })
  @Expose()
  role: UserRoleEnum;
}
