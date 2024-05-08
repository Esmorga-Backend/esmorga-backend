import { IsNumber, IsString } from 'class-validator';

export class Location {
  @IsNumber()
  lat: number;

  @IsNumber()
  long: number;

  @IsString()
  name: string;
}
