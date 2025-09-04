import { IntersectionType, ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { EventDto } from './event.dto';

class CreatorFlagDto {
  @Expose()
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'Indicates if the current user created the event',
    default: true,
  })
  isCreatedByCurrentUser: boolean = true;
}

export class EventWithCreatorFlagDto extends IntersectionType(EventDto, CreatorFlagDto) {}
