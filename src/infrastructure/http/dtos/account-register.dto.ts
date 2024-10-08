import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ACCOUNT_REGEX } from '../../../domain/regex';

export class AccountRegisterDto {
  @Matches(ACCOUNT_REGEX.NAME, {
    message: `name only accept letters (Uppercase or lowercase), spaces and ''',  '-'`,
  })
  @MinLength(3, { message: 'name must have min 3 characters' })
  @MaxLength(100, { message: 'name must have max 100 characters' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John', minLength: 3, maxLength: 100 })
  name: string;

  @Matches(ACCOUNT_REGEX.NAME, {
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
  @Matches(ACCOUNT_REGEX.EMAIL, {
    message: `email is not correctly formatted. Additionally, we do not accept '+' or ' '. After '@', we only accept letters (uppercase and lowercase), digits, '_', and '-'`,
  })
  @MaxLength(100, { message: 'email must have max 100 characters' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'eventslogin01@yopmail.com', maxLength: 100 })
  email: string;

  @Matches(ACCOUNT_REGEX.PASSWORD, {
    message:
      'password must include at least one digit, one letter and one symbol',
  })
  @MinLength(8, { message: 'password must have min 8 characters' })
  @MaxLength(50, { message: 'password must have max 50 characters' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'SuperSecret1!', minLength: 8, maxLength: 50 })
  password: string;
}
