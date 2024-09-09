import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ActivateAccountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456', minLength: 6, maxLength: 6 })
  verificationCode: string;
}
