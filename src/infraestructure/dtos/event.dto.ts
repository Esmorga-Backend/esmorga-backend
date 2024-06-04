import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsArray,
  IsNumber,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';

class Location {
  @Expose()
  @IsNumber()
  lat: number;

  @Expose()
  @IsNumber()
  long: number;

  @Expose()
  @IsString()
  name: string;
}

export class EventDTO {
  @Transform(({ value }) => value.toString(), { toClassOnly: true })
  @Expose({ name: '_id' })
  @IsString()
  @ApiProperty({ example: '6656e23640e1fdb4ceb23cc9' })
  eventId: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'MobgenFest' })
  eventName: string;

  @Expose()
  @IsDateString()
  @ApiProperty({ example: '2024-03-08T10:05:30.915Z' })
  eventDate: Date;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'Hello World' })
  description: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'Party' })
  eventType: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'img.url' })
  imageUrl: string;

  @Expose()
  @ValidateNested()
  @Type(() => Location)
  @IsObject()
  @ApiProperty({
    type: 'object',
    properties: {
      lat: { type: 'number', example: 43.35525182148881 },
      long: { type: 'number', example: -8.41937931298951 },
      name: { type: 'string', example: 'A Coruña' },
    },
  })
  location: Location;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @ApiProperty({ example: '["Meal", "Music"]' })
  tags: string[];
}
