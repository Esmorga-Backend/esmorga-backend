import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Location } from './location.entity';

export class Event {
  @IsNumber()
  @ApiProperty({ example: '6656e23640e1fdb4ceb23cc9' })
  eventId: string;

  @IsString()
  @ApiProperty({ example: 'MobgenFest' })
  eventName: string;

  @IsDateString()
  @ApiProperty({ example: '2024-03-08T10:05:30.915Z' })
  eventDate: Date;

  @IsString()
  @ApiProperty({ example: 'Hello World' })
  description: string;

  @IsString()
  @ApiProperty({ example: 'Party' })
  eventType: string;

  @IsString()
  @ApiProperty({ example: 'img.url' })
  imageUrl: string;

  @ValidateNested()
  @Type(() => Location)
  location: Location;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ example: '["Meal", "Music"]' })
  tags: string[];

  @IsDateString()
  @ApiProperty({ example: '2024-03-08T10:05:30.915Z' })
  createdAt: Date;

  @IsDateString()
  @ApiProperty({ example: '2024-03-08T10:05:30.915Z' })
  updatedAt: Date;
}
