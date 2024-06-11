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
  @ApiPropertyOptional({ example: 43.35525182148881 })
  lat?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: -8.41937931298951 })
  long?: number;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'A Coruña' })
  name: string;
}

export class EventDto {
  @Expose({ name: '_id' })
  @Transform((value) => value.obj._id.toString())
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
  @ApiPropertyOptional({ example: '["Meal", "Music"]' })
  tags?: string[];
}
