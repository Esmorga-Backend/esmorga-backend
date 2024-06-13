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
};

export class AccountRegisterDto {
  @Matches(ACCOUNT_REGISTER_REGEX.NAME, {
    message: `name only accept letters (Uppercase or lowercase), spaces and ''',  '-'`,
  })
  @MinLength(3, { message: 'name must have min 3 characters' })
  @MaxLength(100, { message: 'name must have max 100 characters' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(ACCOUNT_REGISTER_REGEX.NAME, {
    message: `lastName only accept letters (Uppercase or lowercase), spaces and ''',  '-'`,
  })
  @MinLength(3, { message: 'lastName must have min 3 characters' })
  @MaxLength(100, { message: 'lastName must have max 100 characters' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  email: string;

  password: string;
}
