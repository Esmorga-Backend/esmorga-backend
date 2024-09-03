import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class EmailDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @Matches(/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: `email is not correctly formatted. Additionally, we do not accept '+' or ' '. After '@', we only accept letters (uppercase and lowercase), digits, '_', and '-'`,
  })
  @MaxLength(100, { message: 'email must have max 100 characters' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'eventslogin01@yopmail.com', maxLength: 100 })
  email: string;
}
