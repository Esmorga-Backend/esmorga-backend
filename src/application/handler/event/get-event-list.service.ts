import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  EventRepository,
  EventParticipantsRepository,
} from '../../../infrastructure/db/repositories';
import { filterAvailableEvents } from '../../../domain/services';
import {
  EventDto,
  EventListDto,
  EventParticipantsDto,
} from '../../../infrastructure/dtos';

@Injectable()
export class GetEventListService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly eventRepository: EventRepository,
    private readonly eventParticipantsRepository: EventParticipantsRepository,
  ) {}

  /**
   * Provide a list of available events and the counter of them.
   *
   * @returns - Object containing the total number of available events and the list of available events.
   */
  async find(requestId?: string): Promise<EventListDto> {
    try {
      this.logger.info(
        `[GetEventListService] [find] - x-request-id: ${requestId}`,
      );

      const events: EventDto[] = await this.eventRepository.getEventList();
      const eventsParticipantLists: EventParticipantsDto[] =
        (await this.eventParticipantsRepository.getAllEventsParticipantList(
          requestId,
        )) ?? [];

      const availableEvents = filterAvailableEvents(events);

      const updatedEvents = availableEvents.map((event) => {
        const eventParticipantsInfo = eventsParticipantLists.find(
          ({ eventId }) => eventId === event.eventId,
        );
        const currentAttendeeCount =
          eventParticipantsInfo?.participants?.length ?? 0;

        return {
          ...event,
          currentAttendeeCount,
        };
      });

      return {
        totalEvents: updatedEvents.length,
        events: updatedEvents,
      };
    } catch (error) {
      this.logger.error(
        `[GetEventListService] [find] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw error;
    }
  }
}
