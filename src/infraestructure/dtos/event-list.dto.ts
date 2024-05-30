import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EventDTO } from './event.dto';

export class EventListDTO {
  @IsNumber()
  @ApiProperty({ example: 5 })
  totalEvents: number;

  @ValidateNested()
  @Type(() => EventDTO)
  @ApiProperty({ type: [EventDTO] })
  events: EventDTO[];
}
