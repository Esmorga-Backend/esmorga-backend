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
  PASSWORD: /(?=.*[0-9])(?=.*[!@#$%^&*()_+])/,
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

  @Matches(ACCOUNT_REGISTER_REGEX.PASSWORD, {
    message: 'password must include at least one digit and one symbol',
  })
  @MinLength(8, { message: 'password must have min 8 characters' })
  @MaxLength(50, { message: 'password must have max 50 characters' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
