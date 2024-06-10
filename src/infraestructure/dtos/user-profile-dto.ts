import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsDateString, IsString } from 'class-validator';

export class UserProfileDTO {
  @Transform((value) => value.obj._id.toString())
  @Expose({ name: '_id' })
  @IsString()
  @ApiProperty({ example: '665f019c17331ebee550b2fd' })
  uuid: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'Test Name' })
  name: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'esmorga.test.01@yopmail.com' })
  email: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'USER' })
  role: string;

  @Expose()
  @IsDateString()
  @ApiProperty({ example: '2024-03-08T10:05:30.915Z' })
  createdAt: Date;
}
