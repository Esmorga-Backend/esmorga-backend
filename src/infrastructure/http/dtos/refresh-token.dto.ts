import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNjY1ZjAxOWMxNzMzMWViZWU1NTBiMmZkIiwiaWF0IjoxNzE4MDE2NDMzfQ.CXgzuTrEI38H02-f_Jv3LEa_W5K6pAGXwVIDf6902S',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
