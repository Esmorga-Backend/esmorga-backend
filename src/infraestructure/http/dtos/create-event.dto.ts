import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
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
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ValidateIf((location) => location.long)
  @IsNotEmpty()
  @IsNumber()
  lat?: number;

  @ValidateIf((location) => location.lat)
  @IsNotEmpty()
  @IsNumber()
  long?: number;
}

export class CreateEventDto {
  @ApiProperty({ example: 'End of the World Party' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  eventName: string;

  @ApiProperty({ example: '2025-03-08T10:05:30.915Z' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
    message: 'eventDate must be in ISO format (yyyy-MM-ddTHH:mm:ss.SSSZ)',
  })
  @IsValidDate({ message: 'eventDate must be a valid date and time' })
  @IsNotPastDate({ message: 'eventDate can not be a past date' })
  eventDate: string;

  @ApiProperty({
    example:
      'Join us for an unforgettable celebration as we dance into the apocalypse.',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  description: string;

  @ApiProperty({ example: 'Party' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(EventType)
  eventType: EventType;

  @ApiProperty({ example: 'image.url' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @ApiProperty({
    type: 'object',
    properties: {
      name: { type: 'string', example: 'A Coruña' },
      lat: { type: 'number', example: 43.35525182148881 },
      long: { type: 'number', example: -8.41937931298951 },
    },
  })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({ example: ['Dance', 'Music'] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MinLength(3, { each: true })
  @MaxLength(25, { each: true })
  @Transform(({ value }) => [
    ...new Set(
      value.map((tag) => (typeof tag === 'string' ? tag.toUpperCase() : tag)),
    ),
  ])
  tags?: string[];
}
