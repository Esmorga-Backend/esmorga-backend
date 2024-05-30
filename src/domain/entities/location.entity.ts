import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class Location {
  @IsNumber()
  @ApiProperty({ example: 43.35525182148881 })
  lat: number;

  @IsNumber()
  @ApiProperty({ example: -8.41937931298951 })
  long: number;

  @IsString()
  @ApiProperty({ example: 'A Coruña' })
  name: string;
}
