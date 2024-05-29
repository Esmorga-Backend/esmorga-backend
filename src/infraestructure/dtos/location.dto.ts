import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class LocationDTO {
  @Expose()
  @IsNumber()
  @ApiProperty({ example: 43.35525182148881 })
  lat: number;

  @Expose()
  @IsNumber()
  @ApiProperty({ example: -8.41937931298951 })
  long: number;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'A Coruña' })
  name: string;
}
