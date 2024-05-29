import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { Location } from './location.dto';

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
  @ApiProperty({ type: Location })
  location: Location;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ example: '["Meal", "Music"]' })
  tags: string[];

  @Expose()
  @IsDateString()
  @ApiProperty({ example: '2024-03-08T10:05:30.915Z' })
  createdAt: Date;

  @Expose()
  @IsDateString()
  @ApiProperty({ example: '2024-03-08T10:05:30.915Z' })
  updatedAt: Date;
}
