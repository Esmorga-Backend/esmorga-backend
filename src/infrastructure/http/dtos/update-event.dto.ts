import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import {
  IsValidDate,
  IsNotPastDate,
  IsNotEmptyArray,
  IsNotEmptyObject,
} from './custom-decorators';

import { EVENT_TYPE } from '../../../domain/const';

class UpdateEventLocationDto {
  @MinLength(1, { message: 'name must have min 1 character' })
  @MaxLength(100, { message: 'name must have max 100 characters' })
  @IsString()
  @IsDefined({ message: 'name should not be empty' })
  @ApiPropertyOptional({ example: 'A Coruña', minLength: 1, maxLength: 100 })
  @IsOptional()
  name?: string;

  @IsNumber({}, { message: 'lat must be a number' })
  @IsNotEmpty({
    message: 'lat must be defined if long is already define',
  })
  @ValidateIf((location) => location.long)
  @ApiPropertyOptional({
    example: 43.35525182148881,
    maximum: 90,
    minimum: -90,
    description: 'GPS Latitude',
  })
  @IsOptional()
  lat?: number;

  @IsNumber({}, { message: 'long must be a number' })
  @IsNotEmpty({
    message: 'long must be defined if lat is already define',
  })
  @ValidateIf((location) => location.lat)
  @ApiPropertyOptional({
    example: -8.41937931298951,
    maximum: 180,
    minimum: -180,
    description: 'GPS Longitude',
  })
  @IsOptional()
  long?: number;
}

export class UpdateEventDto {
  @ApiProperty({
    example: '6656e23640e1fdb4ceb23cc9',
    minLength: 24,
    maxLength: 24,
  })
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiPropertyOptional({
    example: 'End of the World Party',
    minLength: 3,
    maxLength: 100,
  })
  @MinLength(3, { message: 'eventName must have min 3 characters' })
  @MaxLength(100, { message: 'eventName must have max 100 characters' })
  @IsString()
  @IsOptional()
  eventName?: string;

  @ApiPropertyOptional({
    example: '3000-03-08T10:05:30.915Z',
    format: 'date-time',
  })
  @IsNotPastDate({ message: 'eventDate cannot be in the past' })
  @IsValidDate({ message: 'eventDate must be valid' })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
    message: 'eventDate must be in ISO format (yyyy-MM-ddTHH:mm:ss.SSSZ)',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  eventDate?: string;

  @ApiPropertyOptional({
    example:
      'Join us for an unforgettable celebration as we dance into the apocalypse.',
    minLength: 4,
    maxLength: 5000,
  })
  @MinLength(4, { message: 'description must have min 4 characters' })
  @MaxLength(5000, { message: 'description must have max 5000 characters' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'Party', enum: EVENT_TYPE })
  @IsEnum(EVENT_TYPE)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  eventType?: EVENT_TYPE;

  @ApiPropertyOptional({ example: 'image.url', maxLength: 500 })
  @MaxLength(500, {
    message: 'imageUrl must have max 500 characters',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ type: UpdateEventLocationDto })
  @IsNotEmpty()
  @IsNotEmptyObject({ message: 'location should not be empty' })
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateEventLocationDto)
  @IsOptional()
  location?: UpdateEventLocationDto;

  @ApiPropertyOptional({
    example: ['Dance', 'Music'],
    minLength: 3,
    maxLength: 25,
  })
  @IsOptional()
  @MinLength(3, {
    each: true,
    message: 'tags must have min 3 characters for each tag',
  })
  @MaxLength(25, {
    each: true,
    message: 'tags must have max 25 characters for each tag',
  })
  @IsString({ each: true })
  @ArrayMaxSize(10, { message: 'tags must have max 10 elements' })
  @IsNotEmptyArray({ message: 'tags should not be empty' })
  @IsArray({ message: 'tags must be an array' })
  @Transform(({ value }) => {
    if (value === null) {
      return null;
    }

    return Array.isArray(value)
      ? [
          ...new Set(
            value.map((tag) =>
              typeof tag === 'string' ? tag.toUpperCase() : tag,
            ),
          ),
        ]
      : value;
  })
  tags?: string[];

  @ApiPropertyOptional({
    example: '3000-02-27T10:05:30.915Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsNotPastDate({ message: 'joinDeadline cannot be in the past' })
  @IsValidDate({ message: 'joinDeadline must be valid' })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
    message: 'joinDeadline must be in ISO format (yyyy-MM-ddTHH:mm:ss.SSSZ)',
  })
  @IsString()
  joinDeadline?: string;

  @ApiPropertyOptional({ example: 50 })
  @IsPositive({ message: 'maxCapacity must be greater than 0' })
  @IsNumber({}, { message: 'maxCapacity must be a number' })
  @IsOptional()
  maxCapacity?: number;
}
