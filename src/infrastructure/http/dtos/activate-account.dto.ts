import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ActivateAccountDto {
  @MinLength(6, { message: 'verificationCode have min 6 characters' })
  @MaxLength(6, { message: 'verificationCode have max 6 characters' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456', minLength: 6, maxLength: 6 })
  verificationCode: string;
}
