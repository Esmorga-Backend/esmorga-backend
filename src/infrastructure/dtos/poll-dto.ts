import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';

class OptionDto {
  @Expose({ name: '_id' })
  @Transform((value) => value.obj._id.toString(), { toClassOnly: true })
  @IsString()
  @ApiProperty({
    minLength: 24,
    maxLength: 24,
    example: '6656e23640e1fdb4ceb23cc9',
  })
  optionId: string;

  @Expose()
  @IsString()
  @ApiProperty({
    minLength: 1,
    maxLength: 100,
    example: '13 de Marzo',
  })
  option: string;

  @Expose({ toClassOnly: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : undefined))
  @IsArray()
  @IsString({ each: true })
  @ApiHideProperty()
  votes?: string[];

  @Expose()
  @Transform(({ obj }) => (obj.votes ? obj.votes.length : 0), {
    toClassOnly: true,
  })
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    default: 0,
    minimum: 0,
    example: 7,
  })
  voteCount: number;
}

export class PollDto {
  @Expose({ name: '_id' })
  @Transform((value) => value.obj._id.toString(), { toClassOnly: true })
  @IsString()
  @ApiProperty({
    example: '6656e23640e1fdb4ceb23cc9',
    minLength: 24,
    maxLength: 24,
  })
  pollId: string;

  @Expose()
  @IsString()
  @ApiProperty({
    example: 'Festival de Talentos',
    minLength: 3,
    maxLength: 100,
  })
  pollName: string;

  @Expose()
  @IsString()
  @ApiProperty({
    example:
      'Trae tu talento más absurdo u original: desde silbar al revés hasta hacer la ola con las cejas. No juzgamos, ¡solo aplaudimos!',
    minLength: 2,
    maxLength: 1000,
  })
  description: string;

  @Expose()
  @Transform(({ value }) => (value ? value : undefined))
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'img.url', maxLength: 500 })
  imageUrl?: string;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  @IsArray()
  @ApiProperty({
    type: [OptionDto],
    minItems: 2,
    maxItems: 5,
    example: [
      {
        optionId: '6656e23640e1fdb4ceb23cc9',
        option: '13 de Marzo',
        voteCount: 9,
      },
      {
        optionId: '6656e23640e1fdb4ceb23cd0',
        option: '27 de Marzo',
        voteCount: 7,
      },
      {
        optionId: '6656e23640e1fdb4ceb23cd1',
        option: '3 de Abril',
        voteCount: 5,
      },
    ],
  })
  options: OptionDto[];

  @Expose()
  @IsDateString()
  @ApiProperty({
    example: '3000-02-27T10:05:30.915Z',
    format: 'date-time',
  })
  voteDeadline: Date;

  @Expose()
  @IsBoolean()
  @ApiProperty({ example: true })
  isMultipleChoice: boolean;

  @Expose()
  @Transform(({ value }) => value ?? [])
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['66bf14645889ad6768d02080', '68eface016612de1594eeabf'],
  })
  userSelectedOptions?: string[];
}
