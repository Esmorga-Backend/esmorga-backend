import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  IsNotEmptyArray,
  IsNotPastDate,
  IsValidDate,
} from './custom-decorators';

export class CreatePollDto {
  @ApiProperty({
    example: 'Festival de Talentos',
    minLength: 3,
    maxLength: 100,
  })
  @MinLength(3, { message: 'pollName must have min 3 characters' })
  @MaxLength(100, { message: 'pollName must have max 100 characters' })
  @IsString()
  @IsNotEmpty()
  pollName: string;

  @ApiProperty({
    example:
      'Trae tu talento más absurdo u original: desde silbar al revés hasta hacer la ola con las cejas. No juzgamos, ¡solo aplaudimos!',
    minLength: 2,
    maxLength: 1000,
  })
  @MinLength(2, { message: 'description must have min 2 characters' })
  @MaxLength(1000, { message: 'description must have max 1000 characters' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'image.url', maxLength: 500 })
  @MaxLength(500, {
    message: 'imageUrl must have max 500 characters',
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    example: ['13 de Marzo', '27 de Marzo', '3 de Abril'],
    minItems: 2,
    maxItems: 5,
    minLength: 1,
    maxLength: 100,
  })
  @ArrayUnique((option: string) => option.trim().toLowerCase(), {
    message: 'options cannot be duplicated',
  })
  @MinLength(1, {
    each: true,
    message: 'options must have min 1 character for each option',
  })
  @MaxLength(100, {
    each: true,
    message: 'options must have max 100 characters for each option',
  })
  @IsString({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(5)
  @IsArray()
  @IsNotEmptyArray({ message: 'options should not be empty' })
  options: string[];

  @ApiProperty({
    example: '3000-02-27T10:05:30.915Z',
    format: 'date-time',
  })
  @IsNotPastDate({ message: 'voteDeadline cannot be in the past' })
  @IsValidDate({ message: 'voteDeadline must be valid' })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, {
    message: 'voteDeadline must be in ISO format (yyyy-MM-ddTHH:mm:ss.SSSZ)',
  })
  @IsString()
  @IsNotEmpty()
  voteDeadline: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  isMultipleChoice: boolean;
}
