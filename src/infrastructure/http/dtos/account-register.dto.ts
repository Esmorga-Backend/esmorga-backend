import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// Regex for name and lastName is the same one
export const ACCOUNT_REGISTER_REGEX = {
  NAME: /^[A-Za-z\s'-]+$/,
  EMAIL: /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+'])/,
};

export class AccountRegisterDto {
  @Matches(ACCOUNT_REGISTER_REGEX.NAME, {
    message: `name only accept letters (Uppercase or lowercase), spaces and ''',  '-'`,
  })
  @MinLength(3, { message: 'name must have min 3 characters' })
  @MaxLength(100, { message: 'name must have max 100 characters' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John', minLength: 3, maxLength: 100 })
  name: string;

  @Matches(ACCOUNT_REGISTER_REGEX.NAME, {
    message: `lastName only accept letters (Uppercase or lowercase), spaces and ''',  '-'`,
  })
  @MinLength(3, { message: 'lastName must have min 3 characters' })
  @MaxLength(100, { message: 'lastName must have max 100 characters' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Donnel-Vic', minLength: 3, maxLength: 100 })
  lastName: string;

  /**
   * Transform is executed before @IsString() decorator so if value is not a string, @Transform()
   * returns the request body value and breaks with @IsString() decorator logic
   */
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @Matches(ACCOUNT_REGISTER_REGEX.EMAIL, {
    message:
      'email do not accept +, spaces and after the @ only letters (Uppercase or lowercase) and digits are allowed, _ - ',
  })
  @MaxLength(100, { message: 'email must have max 100 characters' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'eventslogin01@yopmail.com', maxLength: 100 })
  email: string;

  @Matches(ACCOUNT_REGISTER_REGEX.PASSWORD, {
    message: 'password must include at least one digit and one symbol',
  })
  @MinLength(8, { message: 'password must have min 8 characters' })
  @MaxLength(50, { message: 'password must have max 50 characters' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'SuperSecret1!', minLength: 8, maxLength: 50 })
  password: string;
}
