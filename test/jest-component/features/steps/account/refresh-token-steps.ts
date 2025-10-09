import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import { SessionGenerator } from '../../../../../src/domain/services';
import { SESSION_MOCK_DB } from '../../../../mocks/db';
import { SESSION_ID } from '../../../../mocks/db/common';
import { UserDA } from '../../../../../src/infrastructure/db/modules/none/user-da';
import { SessionDA } from '../../../../../src/infrastructure/db/modules/none/session-da';

export const refreshTokenSteps: StepDefinitions = ({ given, and }) => {
  let TTL = 0;
  given('the POST RefreshToken API is available', () => {
    const configService = moduleFixture.get<ConfigService>(ConfigService);
    TTL = configService.get('ACCESS_TOKEN_TTL');
    context.userDA = moduleFixture.get<UserDA>(UserDA);
    context.sessionDA = moduleFixture.get<SessionDA>(SessionDA);
    context.sessionGenerator =
      moduleFixture.get<SessionGenerator>(SessionGenerator);
    context.jwtService = moduleFixture.get<JwtService>(JwtService);
    context.path = '/v1/account/refresh';
    jest.spyOn(context.sessionDA, 'findOneBySessionId').mockResolvedValue(null);

    jest.spyOn(context.sessionGenerator, 'generateTokens').mockResolvedValue({
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken',
      sessionId: 'SESSION_ID',
      refreshTokenId: 'newRefreshTokenId',
    });

    jest.spyOn(context.sessionDA, 'updateById').mockResolvedValue(null);
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
              id: SESSION_MOCK_DB.refreshTokenId,
            };
          }
        });

      jest
        .spyOn(context.sessionDA, 'findOneBySessionId')
        .mockResolvedValue(SESSION_MOCK_DB);
    }
  });

  and(
    'a new accessToken and refreshToken is provided with valid ttl by env.',
    () => {
      expect(context.response.body).toMatchObject({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
        ttl: TTL,
      });
    },
  );
};
