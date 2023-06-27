import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ required: true, minLength: 3 })
  @IsEmail()
  @MinLength(3)
  email: string;

  @ApiProperty({ required: true, minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ required: true, minLength: 6 })
  @IsString()
  @MinLength(6)
  passwordConfirm: string;

  @ApiProperty({ required: true, minLength: 3 })
  @IsString()
  @MinLength(3)
  firstName: string;

  @ApiProperty({ required: true, minLength: 3 })
  @IsString()
  @MinLength(3)
  lastName: string;
}
