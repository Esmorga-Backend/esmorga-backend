import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import {
  SESSION_MOCK_DB,
  EVENT_PARTICIPANT_MOCK_DB,
  FUTURE_EVENT_MOCK_DTO,
  OLD_EVENT_MOCK_DTO,
  EVENT_CORE_FIELDS_MOCK_DTO,
} from '../../../../mocks/db';
import { HEADERS } from '../../../../mocks/common-data';
import { SESSION_ID } from '../../../../mocks/db/common';
import { EventDA } from '../../../../../src/infrastructure/db/modules/none/event-da';
import { EventParticipantsDA } from '../../../../../src/infrastructure/db/modules/none/event-participant-da';
import { SessionDA } from '../../../../../src/infrastructure/db/modules/none/session-da';

const PATH = '/v1/account/events';

const METHOD = 'get';

export const getMyEventsStepts: StepDefinitions = ({ given, and }) => {
  // TC-104 TC-105 TC-106 TC-107 TC-108
  given('the GET My events API is available', () => {
    context.path = PATH;

    context.method = METHOD;

    context.headers = HEADERS;

    context.jwtService = moduleFixture.get<JwtService>(JwtService);

    context.eventDA = moduleFixture.get<EventDA>(EventDA);

    context.sessionDA = moduleFixture.get<SessionDA>(SessionDA);

    context.eventParticipantsDA =
      moduleFixture.get<EventParticipantsDA>(EventParticipantsDA);

    jest
      .spyOn(context.eventParticipantsDA, 'findEventParticipant')
      .mockResolvedValue([EVENT_PARTICIPANT_MOCK_DB]);
  });

  // TC-104 TC-105 TC-107 TC-108
  and('I am authenticated with a valid accessToken', () => {
    jest
      .spyOn(context.jwtService, 'verifyAsync')
      .mockResolvedValue({ sessionId: SESSION_ID });

    jest
      .spyOn(context.sessionDA, 'findOneBySessionId')
      .mockResolvedValue(SESSION_MOCK_DB);
  });

  // TC-106
  and('I am using an invalid accessToken', () => {
    jest.spyOn(context.jwtService, 'verifyAsync').mockRejectedValue({});
  });

  // TC-105
  and('there are not upcoming events that I have joined', () => {
    jest
      .spyOn(context.eventParticipantsDA, 'findEventParticipant')
      .mockResolvedValue([]);

    jest.spyOn(context.eventDA, 'findByEventIds').mockResolvedValue([]);
  });

  // TC-104
  and('there are upcoming events that I have joined', () => {
    jest
      .spyOn(context.eventDA, 'findByEventIds')
      .mockResolvedValue([FUTURE_EVENT_MOCK_DTO]);
  });

  // TC-107
  and('I only joined celebrated events', () => {
    jest
      .spyOn(context.eventDA, 'findByEventIds')
      .mockResolvedValue([OLD_EVENT_MOCK_DTO]);
  });

  // TC-108
  and('there are upcoming events I have joined that are missing data', () => {
    jest
      .spyOn(context.eventDA, 'findByEventIds')
      .mockResolvedValue([EVENT_CORE_FIELDS_MOCK_DTO]);
  });

  // TC-105 TC-107
  and('the response must include a empty array', () => {
    expect(context.response.body).toEqual({
      totalEvents: 0,
      events: [],
    });
  });

  // TC-108
  and('the response should exclude any event field with missing data', () => {
    const event = context.response.body.events[0];

    expect(context.response.body.totalEvents).toBe(1);
    expect(event.imageUrl).not.toBeDefined();
    expect(event.location.lat).not.toBeDefined();
    expect(event.location.long).not.toBeDefined();
    expect(event.tags).not.toBeDefined();
  });
};
