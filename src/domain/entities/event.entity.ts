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
  eventId: number;

  @IsString()
  eventName: string;

  @IsDateString()
  eventDate: Date;

  @IsString()
  description: string;

  @IsString()
  eventType: string;

  @IsString()
  imageUrl: string;

  @ValidateNested()
  @Type(() => Location)
  location: Location;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
