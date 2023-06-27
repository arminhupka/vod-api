import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  companyName: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  vatNumber: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  street: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  postCode: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false, minLength: 6 })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password: string;

  @ApiProperty({ required: false, minLength: 6 })
  @IsString()
  @IsOptional()
  @ValidateIf((p) => !!p.password)
  @MinLength(6)
  passwordConfirm: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  companyStreet: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  companyCountry: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  companyCity: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  companyPostCode: string;
}
