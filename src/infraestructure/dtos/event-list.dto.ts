import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EventDto } from './event.dto';

export class EventListDto {
  @IsNumber()
  @ApiProperty({ example: 5 })
  totalEvents: number;

  @ValidateNested()
  @Type(() => EventDto)
  @ApiProperty({ type: [EventDto] })
  events: EventDto[];
}
