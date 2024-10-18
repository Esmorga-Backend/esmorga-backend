import { Injectable, NotImplementedException } from '@nestjs/common';

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
  ): Promise<void> {
    throw new NotImplementedException();
  }
  removeParticipantFromList(_eventId: string, _userId: string): Promise<void> {
    throw new NotImplementedException();
  }
}
