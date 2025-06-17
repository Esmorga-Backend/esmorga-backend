import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';

import { HEADERS } from '../../../../mocks/common-data';
import { SessionDA } from '../../../../../src/infrastructure/db/modules/none/session-da';

const PATH = '/v1/account/session';

const METHOD = 'delete';

export const closeCurrentSessionStep: StepDefinitions = ({ and, given }) => {
  given('the DELETE Session API is available', () => {
    context.path = PATH;

    context.method = METHOD;

    context.headers = { ...HEADERS };

    context.jwtService = moduleFixture.get<JwtService>(JwtService);

    context.sessionDA = moduleFixture.get<SessionDA>(SessionDA);

    jest.spyOn(context.sessionDA, 'removeBySessionId').mockResolvedValue(null);
  });

  given('without auth', () => {
    delete context.headers['Authorization'];
  });

  and('none token pair is removed from the system', () => {
    expect(context.sessionDA.removeBySessionId).not.toHaveBeenCalledWith();
  });
};
