import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsArray,
  IsNumber,
  ValidateNested,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { EVENT_TYPE } from '../../domain/const';

class LocationDto {
  @Expose()
  @Transform(({ value }) => (value ? value : undefined))
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    example: 43.35525182148881,
    maximum: 90,
    minimum: -90,
    description: 'GPS Latitude',
  })
  lat?: number;

  @Expose()
  @Transform(({ value }) => (value ? value : undefined))
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    example: -8.41937931298951,
    maximum: 180,
    minimum: -180,
    description: 'GPS Longitude',
  })
  long?: number;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'A Coruña', minLength: 1, maxLength: 100 })
  name: string;
}

export class EventDto {
  @Expose({ name: '_id' })
  @Transform((value) => value.obj._id.toString(), { toClassOnly: true })
  @IsString()
  @ApiProperty({
    example: '6656e23640e1fdb4ceb23cc9',
    minLength: 24,
    maxLength: 24,
  })
  eventId: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'MobgenFest', minLength: 3, maxLength: 100 })
  eventName: string;

  @Expose()
  @IsDateString()
  @ApiProperty({
    example: '2024-03-08T10:05:30.915Z',
    format: 'date-time',
  })
  eventDate: Date;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'Hello World', minLength: 4, maxLength: 5000 })
  description: string;

  @Expose()
  @IsString()
  @ApiProperty({
    example: 'Party',
    enum: EVENT_TYPE,
  })
  eventType: string;

  @Expose()
  @Transform(({ value }) => (value ? value : undefined))
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'img.url', maxLength: 500 })
  imageUrl?: string;

  @Expose()
  @ValidateNested()
  @Type(() => LocationDto)
  @IsObject()
  @ApiProperty({ type: LocationDto })
  location: LocationDto;

  @Expose()
  @Transform(({ value }) => (value?.length > 0 ? value : undefined))
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @IsOptional()
  @ApiPropertyOptional({
    example: ['Dance', 'Music'],
    minLength: 3,
    maxLength: 25,
  })
  tags?: string[];

  @Expose()
  @Transform(({ value, obj }) => value ?? obj.eventDate)
  @IsDateString()
  @ApiProperty({
    example: '2024-03-03T10:05:30.915Z',
    format: 'date-time',
  })
  joinDeadline?: Date;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 50 })
  maxCapacity?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 13,
    default: 0,
  })
  currentAttendeeCount: number;
}
