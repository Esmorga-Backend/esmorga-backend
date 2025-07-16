import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ACCOUNT_REGEX } from '../../../domain/regex';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'SuperSecret1!' })
  currentPassword: string;

  @Matches(ACCOUNT_REGEX.PASSWORD, {
    message:
      'password must include at least one digit, one letter and one symbol',
  })
  @MinLength(8, { message: 'password must have min 8 characters' })
  @MaxLength(50, { message: 'password must have max 50 characters' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'SuperSecret2!', minLength: 8, maxLength: 50 })
  newPassword: string;
}
