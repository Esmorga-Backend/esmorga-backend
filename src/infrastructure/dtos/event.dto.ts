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

class LocationDto {
  @Expose()
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
  @Transform((value) => value.obj._id.toString())
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
    enum: ['Party', 'Sport', 'Food', 'Charity', 'Games'],
  })
  eventType: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'img.url' })
  imageUrl?: string;

  @Expose()
  @ValidateNested()
  @Type(() => LocationDto)
  @IsObject()
  @ApiProperty({ type: LocationDto })
  location: LocationDto;

  @Expose()
  @Transform(({ value }) => (value.length > 0 ? value : undefined))
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
}
