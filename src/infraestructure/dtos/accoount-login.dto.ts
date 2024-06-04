import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AccountLoginDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'esmorga.test.01@yopmail.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Password01' })
  password: string;
}
