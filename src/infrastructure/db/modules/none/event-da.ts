import { Injectable, NotImplementedException } from '@nestjs/common';
import { EventDto, EventWithCreatorFlagDto } from '../../../dtos';
import { CreateEventDto } from '../../../http/dtos';

@Injectable()
export class EventDA {
  find(): Promise<EventDto[]> {
    throw new NotImplementedException();
  }
  create(_event: CreateEventDto, _email: string): Promise<void> {
    throw new NotImplementedException();
  }
  findOneById(_eventId: string): Promise<EventDto | null> {
    throw new NotImplementedException();
  }
  findByEmail(_email: string): Promise<EventWithCreatorFlagDto[]> {
    throw new NotImplementedException();
  }
  findByEventIds(_eventIds: string[]): Promise<EventDto[]> {
    throw new NotImplementedException();
  }
  updateById(
    _eventId: string,
    _eventUpdate: Partial<EventDto> & { updatedBy: string },
  ): Promise<EventDto | null> {
    throw new NotImplementedException();
  }
  removeById(_eventId: string): Promise<void> {
    throw new NotImplementedException();
  }
}
