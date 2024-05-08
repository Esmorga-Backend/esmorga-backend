import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Location {
  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  long: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}
