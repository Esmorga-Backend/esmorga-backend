import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';

class Profile {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  lastName: string;

  @Expose()
  @IsString()
  email: string;

  @Expose()
  @IsString()
  role: string;
}

export class AccountLoggedDto {
  @Expose()
  @IsString()
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNjY1ZjAxOWMxNzMzMWViZWU1NTBiMmZkIiwiaWF0IjoxNzE4MDE2NDMzLCJleHAiOjE3MTgwMTcwMzN9.migGA-6g8dCJ_4i6-AGQHN4girESXQmn5MtM9U7NhJg',
  })
  accessToken: string;

  @Expose()
  @IsString()
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNjY1ZjAxOWMxNzMzMWViZWU1NTBiMmZkIiwiaWF0IjoxNzE4MDE2NDMzfQ.CXgzuTrEI38H02-f_Jv3LEa_W5K6pAGXwVIDf6902S8',
  })
  refreshToken: string;

  @Expose()
  @IsNumber()
  @ApiProperty({ example: '600' })
  ttl: number;

  @Expose()
  @ValidateNested()
  @Type(() => Profile)
  @IsObject()
  @ApiProperty({
    type: 'object',
    properties: {
      name: { type: 'string', example: 'John', minLength: 3, maxLength: 100 },
      lastName: {
        type: 'string',
        example: 'Donnel-Vic',
        minLength: 3,
        maxLength: 100,
      },
      email: {
        type: 'string',
        example: 'eventslogin01@yopmail.com',
        maxLength: 100,
      },
      role: {
        type: 'string',
        example: 'USER',
      },
    },
  })
  profile: Profile;
}
