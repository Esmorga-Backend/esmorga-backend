import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  AccountRepository,
  EventRepository,
} from '../../../infrastructure/db/repositories';

@Injectable()
export class JoinEventService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async joinEvent(eventId: string, requestId?: string) {
    try {
      this.logger.info(
        `[LoginService] [joinEvent] - x-request-id:${requestId}, eventId ${eventId}`,
      );
    } catch (error) {
      this.logger.error(
        `[LoginService] [joinEvent] - x-request-id:${requestId}, error ${error}`,
      );
    }
  }
}
