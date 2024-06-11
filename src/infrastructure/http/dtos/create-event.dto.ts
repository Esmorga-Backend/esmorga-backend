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
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export enum EventType {
  PARTY = 'PARTY',
  SPORT = 'SPORT',
  FOOD = 'FOOD',
  CHARITY = 'CHARITY',
  GAMES = 'GAMES',
}

function isValidISODate(eventDate: string): boolean {
  const [datePart, timePartWithZ] = eventDate.split('T');
  const timePart = timePartWithZ.replace('Z', '');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second, millisecond] = timePart
    .split(/[:.]/)
    .map(Number);
  const date = new Date(
    Date.UTC(year, month - 1, day, hour, minute, second, millisecond),
  );

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    date.getUTCHours() === hour &&
    date.getUTCMinutes() === minute &&
    date.getUTCSeconds() === second &&
    date.getUTCMilliseconds() === millisecond
  );
}

function IsValidDate(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any) {
          return typeof value === 'string' && isValidISODate(value);
        },
      },
    });
  };
}

function IsNotPastDate(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const date = new Date(value);
          return date > new Date();
        },
      },
    });
  };
}

class LocationDto {
  @MinLength(1, { message: 'name must have min 1 character' })
  @MaxLength(100, { message: 'name must have max 100 characters' })
  @IsString()
  @IsDefined({ message: 'name should not be empty' })
  @ApiProperty({ example: 'A Coruña' })
  name: string;

  @IsNumber({}, { message: 'lat must be a number' })
  @IsNotEmpty({
    message: 'lat must be defined if long is already define',
  })
  @ValidateIf((location) => location.long)
  @ApiPropertyOptional({ example: 43.35525182148881 })
  lat?: number;

  @IsNumber({}, { message: 'long must be a number' })
  @IsNotEmpty({
    message: 'long must be defined if lat is already define',
  })
  @ValidateIf((location) => location.lat)
  @ApiPropertyOptional({ example: -8.41937931298951 })
  long?: number;
}

export class CreateEventDto {
  @ApiProperty({ example: 'End of the World Party' })
  @MinLength(3, { message: 'eventName must have min 3 characters' })
  @MaxLength(100, { message: 'eventName must have max 100 characters' })
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @ApiProperty({ example: '2025-03-08T10:05:30.915Z' })
  @IsNotPastDate({ message: 'eventDate cannot be in the past' })
  @IsValidDate({ message: 'eventDate must be valid' })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
    message: 'eventDate must be in ISO format (yyyy-MM-ddTHH:mm:ss.SSSZ)',
  })
  @IsString()
  @IsNotEmpty()
  eventDate: string;

  /**
   * description can not use @IsNotEmpty() cause this decorator cause it
   * checks !== '', !== null and !== undefined. With !== '', @MinLength()
   * for 1 char will not be thrown.
   * Message for @IsDefined() is addapted as @IsNotEmpty()
   */
  @ApiProperty({
    example:
      'Join us for an unforgettable celebration as we dance into the apocalypse.',
  })
  @MinLength(1, { message: 'description must have min 1 character' })
  @MaxLength(5000, { message: 'description must have max 5000 characters' })
  @IsString()
  @IsDefined({ message: 'description should not be empty' })
  description: string;

  @ApiProperty({ example: 'Party' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(EventType)
  @IsString()
  @IsNotEmpty()
  eventType: EventType;

  @ApiPropertyOptional({ example: 'image.url' })
  @MaxLength(500, {
    message: 'imageUrl description must have max 500 characters',
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ type: LocationDto })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiPropertyOptional({ example: ['Dance', 'Music'] })
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
  @IsArray({ message: 'tags must be an array' })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? [
          ...new Set(
            value.map((tag) =>
              typeof tag === 'string' ? tag.toUpperCase() : tag,
            ),
          ),
        ]
      : value,
  )
  tags?: string[];
}
