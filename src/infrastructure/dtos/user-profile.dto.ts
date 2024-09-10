import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsDateString, IsString } from 'class-validator';

export class UserProfileDto {
  @Transform((value) => value.obj._id.toString())
  @Expose({ name: '_id' })
  @IsString()
  @ApiProperty({ example: '665f019c17331ebee550b2fd' })
  uuid: string;

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

  @Expose()
  @IsString()
  @ApiProperty({ example: 'ACTIVE', maxLength: 100, minLength: 1 })
  status: string;

  @Expose()
  @IsDateString()
  @ApiProperty({ example: '2024-03-08T10:05:30.915Z', format: 'date-time' })
  createdAt: Date;
}
