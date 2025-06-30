import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ACCOUNT_REGEX } from '../../../domain/regex';

export class UpdateForgotPasswordDto {
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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456', minLength: 6, maxLength: 6 })
  forgotPasswordCode: string;
}
