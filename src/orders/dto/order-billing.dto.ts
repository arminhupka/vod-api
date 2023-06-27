import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OrderBillingDto {
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
  country: string;

  @ApiProperty()
  @Expose()
  city: string;

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
