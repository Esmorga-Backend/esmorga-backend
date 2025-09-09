import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class ProfileDto {
  @Expose()
  @IsString()
  @ApiProperty({ example: 'John', maxLength: 100, minLength: 1 })
  name: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'Donnel-Vic', maxLength: 100, minLength: 1 })
  lastName: string;

  @Expose()
  @IsString()
  @ApiProperty({
    example: 'esmorga.test.01@yopmail.com',
    maxLength: 100,
    minLength: 1,
  })
  email: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'USER', maxLength: 100, minLength: 1 })
  role: string;
}
