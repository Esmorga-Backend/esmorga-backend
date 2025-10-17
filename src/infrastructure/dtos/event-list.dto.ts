import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EventDto } from './event.dto';

export class EventListDto {
  @IsNumber()
  @ApiProperty({ example: 1 })
  totalEvents: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventDto)
  @ApiProperty({ type: [EventDto] })
  events: EventDto[];
}
