import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RefreshTokenDto } from '../../../../../src/infrastructure/http/dtos';
import { REFRESH_TOKEN_MOCK } from '../../../../mocks/dtos';

describe('[unit-test] [RefreshTokenDto]', () => {
  it('Should validate all fields successfully', async () => {
    const refreshTokenDto = plainToInstance(
      RefreshTokenDto,
      REFRESH_TOKEN_MOCK,
    );

    const errors = await validate(refreshTokenDto, { stopAtFirstError: true });

    expect(errors.length).toBe(0);
  });

  describe('[RefreshTokenDto] [refreshToken]', () => {
    it('Should not accept empty value', async () => {
      const refreshTokenData = { ...REFRESH_TOKEN_MOCK };

      delete refreshTokenData.refreshToken;

      const refreshTokenDto = plainToInstance(
        RefreshTokenDto,
        refreshTokenData,
      );

      const errors = await validate(refreshTokenDto, {
        stopAtFirstError: true,
      });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('refreshToken');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'refreshToken should not be empty',
      });
    });

    it('Should only accept string values', async () => {
      const refreshTokenData: any = { ...REFRESH_TOKEN_MOCK };

      refreshTokenData.refreshToken = 123;

      const refreshTokenDto = plainToInstance(
        RefreshTokenDto,
        refreshTokenData,
      );

      const errors = await validate(refreshTokenDto, {
        stopAtFirstError: true,
      });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('refreshToken');
      expect(errors[0].constraints).toEqual({
        isString: 'refreshToken must be a string',
      });
    });
  });
});
