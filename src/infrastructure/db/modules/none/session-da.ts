import { Injectable, NotImplementedException } from '@nestjs/common';
import { SessionDto } from '../../../dtos';

@Injectable()
export class SessionDA {
  create(_uuid: string, _sessionId: string): Promise<void> {
    throw new NotImplementedException();
  }
  findByUuid(_uuid: string): Promise<SessionDto[]> {
    throw new NotImplementedException();
  }
  findOneBySessionId(_sessionId: string): Promise<SessionDto | null> {
    throw new NotImplementedException();
  }
  removeAllByUuid(_uuid: string): Promise<void> {
    throw new NotImplementedException();
  }
  removeById(_id: string): Promise<void> {
    throw new NotImplementedException();
  }
  removeBySessionId(_sessionId: string): Promise<void> {
    throw new NotImplementedException();
  }
}
