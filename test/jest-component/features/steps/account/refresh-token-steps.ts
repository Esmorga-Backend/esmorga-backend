import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import { SessionGenerator } from '../../../../../src/domain/services';
import {
  AccountRepository,
  TokensRepository,
} from '../../../../../src/infrastructure/db/repositories';

import { SESSION_MOCK_DB, TTL_MOCK_DB } from '../../../../mocks/db';
import { SESSION_ID } from '../../../../mocks/db/common';

export const refreshTokenSteps: StepDefinitions = ({ given, and }) => {
  given('the POST RefreshToken API is available', () => {
    context.accountRepository =
      moduleFixture.get<AccountRepository>(AccountRepository);
    context.tokensRepository =
      moduleFixture.get<TokensRepository>(TokensRepository);
    context.sessionGenerator =
      moduleFixture.get<SessionGenerator>(SessionGenerator);
    context.jwtService = moduleFixture.get<JwtService>(JwtService);
    context.path = '/v1/account/refresh';
    jest
      .spyOn(context.tokensRepository, 'findOneBySessionId')
      .mockResolvedValue(null);

    jest.spyOn(context.sessionGenerator, 'generateSession').mockResolvedValue({
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken',
      sessionId: 'SESSION_ID',
    });
    jest.spyOn(context.tokensRepository, 'save').mockResolvedValue(null);

    jest.spyOn(context.tokensRepository, 'removeById').mockResolvedValue(null);
  });

  and(/^use refreshToken (\w+)$/, (refreshToken) => {
    context.mock.refreshToken = refreshToken;
    if (refreshToken === 'null') {
      context.mock.refreshToken = '';
    }

    if (refreshToken === 'refreshToken') {
      jest
        .spyOn(context.jwtService, 'verifyAsync')
        .mockImplementation((_refreshToken) => {
          if (refreshToken === _refreshToken) {
            return {
              sessionId: SESSION_ID,
            };
          }
        });

      jest
        .spyOn(context.tokensRepository, 'findOneBySessionId')
        .mockResolvedValue(SESSION_MOCK_DB);
    }
  });

  and(
    'a new accessToken and refreshToken is provided with valid ttl by env.',
    () => {
      expect(context.response.body).toMatchObject({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
        ttl: TTL_MOCK_DB,
      });
    },
  );
};
