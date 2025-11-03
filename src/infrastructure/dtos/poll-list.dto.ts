import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PollDto } from './poll-dto';

export class PollListDto {
  @IsNumber()
  @ApiProperty({ example: 1 })
  totalPolls: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PollDto)
  @ApiProperty({ type: [PollDto] })
  polls: PollDto[];
}
