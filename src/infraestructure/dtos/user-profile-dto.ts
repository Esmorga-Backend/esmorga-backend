import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class UserProfileDTO {
  @Expose()
  @IsString()
  @ApiProperty({ example: 'Test Name' })
  name: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'esmorga.test.01@yopmail.com' })
  email: string;
}
