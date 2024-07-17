import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import {
  EventRepository,
  TokensRepository,
  EventParticipantsRepository,
} from '../../../../../src/infrastructure/db/repositories';
import {
  FUTURE_EVENT_MOCK_DB,
  PAIR_OF_TOKENS_MOCK_DB,
} from '../../../../mocks/db';

export const joinEventSteps: StepDefinitions = ({ given, and }) => {
  given('I am authenticated', async () => {
    context.path = '/v1/account/events';

    context.jwtService = moduleFixture.get<JwtService>(JwtService);

    context.eventRepository =
      moduleFixture.get<EventRepository>(EventRepository);

    context.tokensRepository =
      moduleFixture.get<TokensRepository>(TokensRepository);

    context.eventParticipantsRepository =
      moduleFixture.get<EventParticipantsRepository>(
        EventParticipantsRepository,
      );

    jest
      .spyOn(context.tokensRepository, 'findOneByAccessToken')
      .mockResolvedValue(PAIR_OF_TOKENS_MOCK_DB);

    jest
      .spyOn(
        context.eventParticipantsRepository,
        'findAndUpdateParticipantsList',
      )
      .mockResolvedValue({});
  });

  and('the accessToken is valid', () => {
    jest.spyOn(context.jwtService, 'verifyAsync').mockResolvedValue(null);
  });

  and('the eventId is valid', () => {
    jest
      .spyOn(context.eventRepository, 'findByIdentifier')
      .mockResolvedValue(FUTURE_EVENT_MOCK_DB);
  });
};
