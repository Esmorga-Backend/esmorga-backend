import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import { HEADERS } from '../../../../mocks/common-data';
import { SESSION_ID, USER_MOCK_DB_ID } from '../../../../mocks/db/common';
import { EventParticipantsDA } from '../../../../../src/infrastructure/db/modules/none/event-participant-da';
import { SessionDA } from '../../../../../src/infrastructure/db/modules/none/session-da';
import { UserDA } from '../../../../../src/infrastructure/db/modules/none/user-da';
import { PollDA } from '../../../../../src/infrastructure/db/modules/none/poll-da';

const PATH = '/v1/account';

const METHOD = 'delete';

export const deleteAccountSteps: StepDefinitions = ({ given, when, and }) => {
  given('the DELETE Account API is available', async () => {
    context.path = PATH;

    context.mock = {
      password: 'Mobgen1!',
    };

    context.method = METHOD;

    context.headers = HEADERS;

    context.jwtService = moduleFixture.get<JwtService>(JwtService);

    context.userDA = moduleFixture.get<UserDA>(UserDA);

    context.pollDA = moduleFixture.get<PollDA>(PollDA);

    context.eventParticipantsDA =
      moduleFixture.get<EventParticipantsDA>(EventParticipantsDA);

    context.sessionDA = moduleFixture.get<SessionDA>(SessionDA);

    context.eventParticipantDA =
      moduleFixture.get<EventParticipantsDA>(EventParticipantsDA);

    jest
      .spyOn(context.jwtService, 'verifyAsync')
      .mockResolvedValue({ sessionId: SESSION_ID });

    jest
      .spyOn(context.sessionDA, 'findOneBySessionId')
      .mockResolvedValue({ uuid: USER_MOCK_DB_ID });

    jest
      .spyOn(context.userDA, 'getCurrentPasswordByUuid')
      .mockResolvedValue('hashed-password');

    jest.spyOn(argon2, 'verify').mockResolvedValue(true);

    jest
      .spyOn(context.eventParticipantsDA, 'removeUserFromAllEvents')
      .mockResolvedValue(null);

    jest
      .spyOn(context.pollDA, 'removeUserFromAllPolls')
      .mockResolvedValue(null);

    jest.spyOn(context.sessionDA, 'removeAllByUuid').mockResolvedValue(null);

    jest.spyOn(context.userDA, 'deleteByUuid').mockResolvedValue(null);
  });

  and('password is correct', () => {
    const verifySpy = jest.spyOn(argon2, 'verify');
    expect(verifySpy).toHaveBeenCalledWith(
      'hashed-password',
      context.mock.password,
    );
  });

  and('user profile data is removed', () => {
    expect(context.userDA.deleteByUuid).toHaveBeenCalled();
  });

  and('user tokens are removed', () => {
    expect(context.sessionDA.removeAllByUuid).toHaveBeenCalled();
  });

  and('participation from polls and events is removed', () => {
    expect(
      context.eventParticipantsDA.removeUserFromAllEvents,
    ).toHaveBeenCalled();
    expect(context.pollDA.removeUserFromAllPolls).toHaveBeenCalled();
  });

  and('the password received does not match the account password', () => {
    jest.spyOn(argon2, 'verify').mockResolvedValue(false);

    expect(context.userDA.deleteByUuid).not.toHaveBeenCalled();
  });

  and('password input is missing', () => {
    context.mock = {
      password: '',
    };
  });
};
