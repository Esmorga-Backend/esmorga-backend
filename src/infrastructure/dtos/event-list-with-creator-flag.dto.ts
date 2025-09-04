import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { EventWithCreatorFlagDto } from './event-with-creator-flag.dto';

export class EventListWithCreatorFlagDto {
  @IsNumber()
  @ApiProperty({ example: 1 })
  totalEvents: number;


  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventWithCreatorFlagDto)
  @ApiProperty({ type: [EventWithCreatorFlagDto] })
  events: EventWithCreatorFlagDto[];
}
