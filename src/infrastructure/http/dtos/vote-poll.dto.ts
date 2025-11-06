import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsNotEmptyArray } from './custom-decorators';

export class VotePollDto {
  @ApiProperty({
    example: [
      '6656e23640e1fdb4ceb23cc9',
      '6656e23640e1fdb4ceb23cca',
      '6656e23640e1fdb4ceb23ccb',
    ],
    minItems: 1,
    maxItems: 5,
    minLength: 24,
    maxLength: 24,
  })
  @ArrayUnique(
    (option: unknown) =>
      typeof option === 'string' ? option.trim().toLowerCase() : option,
    { message: 'optionId cannot be duplicated' },
  )
  @MinLength(24, {
    each: true,
    message: 'selectedOptions must have min 24 characters for each optionId',
  })
  @MaxLength(24, {
    each: true,
    message: 'selectedOptions must have max 24 characters for each optionId',
  })
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsArray()
  @IsNotEmptyArray({ message: 'selectedOptions should not be empty' })
  selectedOptions: string[];
}
