import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class NewPairOfTokensDto {
  @Expose()
  @IsString()
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NIkpXVCJ9.eyJ1dWlkIjoiNjY1ZjAxOWMxiMmZkIiwiaWF0IjoxNzE4MDE2NDMzLCJlcwMzN9.migGA-6g8dCJ_4i6-AGQHN4girESXQmn5MtM9U7NhJg',
  })
  accessToken: string;

  @Expose()
  @IsString()
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzcCI6IkpXVCJ9.eyJ1dWlkIjoiNjY1ZjAxOWMxNzMzMWViZWUjoxNzE4MDE2NDMzfQ.CXgzu8H02-f_Jv3LEa_W5K6pAG2S8',
  })
  refreshToken: string;

  @Expose()
  @IsNumber()
  @ApiProperty({ example: '600' })
  ttl: number;
}
