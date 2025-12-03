import { Injectable, NotImplementedException } from '@nestjs/common';
import { EventParticipantsDto } from '../../../dtos';

@Injectable()
export class EventParticipantsDA {
  findEventParticipant(_userId: string): Promise<string[]> {
    throw new NotImplementedException();
  }

  removeByEventId(_eventId: string): Promise<void> {
    throw new NotImplementedException();
  }

  findAndUpdateParticipantsList(
    _eventId: string,
    _userId: string,
  ): Promise<boolean> {
    throw new NotImplementedException();
  }

  removeParticipantFromList(
    _eventId: string,
    _userId: string,
  ): Promise<boolean> {
    throw new NotImplementedException();
  }

  removeUserFromAllEvents(_userId: string): Promise<void> {
    throw new NotImplementedException();
  }

  findEvent(_eventId: string): Promise<EventParticipantsDto | null> {
    throw new NotImplementedException();
  }

  find(): Promise<EventParticipantsDto[]> {
    throw new NotImplementedException();
  }
}
