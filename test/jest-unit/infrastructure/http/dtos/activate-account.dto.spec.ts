import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ActivateAccountDto } from '../../../../../src/infrastructure/http/dtos';
import { ACTIVATE_ACCOUNT_MOCK } from '../../../../mocks/dtos';

describe('[unit-test] [ActivateAccountDto]', () => {
  it('Should validate all fields successfully', async () => {
    const activateAccountDto = plainToInstance(
      ActivateAccountDto,
      ACTIVATE_ACCOUNT_MOCK,
    );

    const errors = await validate(activateAccountDto, {
      stopAtFirstError: true,
    });

    expect(errors.length).toBe(0);
  });

  describe('[ActivateAccountDto] [verificationCode]', () => {
    it('Should not accept empty email', async () => {
      const activateAccountData = { ...ACTIVATE_ACCOUNT_MOCK };

      delete activateAccountData.verificationCode;

      const activateAccountDto = plainToInstance(
        ActivateAccountDto,
        activateAccountData,
      );

      const errors = await validate(activateAccountDto, {
        stopAtFirstError: true,
      });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('verificationCode');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'verificationCode should not be empty',
      });
    });

    it('Should only accept string values for email field', async () => {
      const activateAccountData = {
        verificationCode: 123456,
      };

      const activateAccountDto = plainToInstance(
        ActivateAccountDto,
        activateAccountData,
      );

      const errors = await validate(activateAccountDto, {
        stopAtFirstError: true,
      });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('verificationCode');
      expect(errors[0].constraints).toEqual({
        isString: 'verificationCode must be a string',
      });
    });

    it('Should not accept less than 6 character', async () => {
      const activateAccountData = {
        verificationCode: '123',
      };

      const activateAccountDto = plainToInstance(
        ActivateAccountDto,
        activateAccountData,
      );

      const errors = await validate(activateAccountDto, {
        stopAtFirstError: true,
      });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('verificationCode');
      expect(errors[0].constraints).toEqual({
        minLength: 'verificationCode must have min 6 characters',
      });
    });

    it('Should not accept more than 6 character', async () => {
      const activateAccountData = {
        verificationCode: '1234567',
      };

      const activateAccountDto = plainToInstance(
        ActivateAccountDto,
        activateAccountData,
      );

      const errors = await validate(activateAccountDto, {
        stopAtFirstError: true,
      });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('verificationCode');
      expect(errors[0].constraints).toEqual({
        maxLength: 'verificationCode must have max 6 characters',
      });
    });
  });
});
