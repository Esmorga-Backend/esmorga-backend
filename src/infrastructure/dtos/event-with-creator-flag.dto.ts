import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { EventDto } from './event.dto';

export class EventWithCreatorFlagDto extends EventDto {
  @Expose()
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'Indicates if the current user created the event',
    default: true,
  })
  isCreatedByCurrentUser: boolean;
}
