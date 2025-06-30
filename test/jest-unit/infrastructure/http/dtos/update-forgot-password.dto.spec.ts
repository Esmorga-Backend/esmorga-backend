import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateForgotPasswordDto } from '../../../../../src/infrastructure/http/dtos';
import { UPDATE_PASSWORD } from '../../../../mocks/dtos';
import { ACCOUNT_REGEX } from '../../../../../src/domain/regex';

describe('[unit-test] [UpdateForgotPasswordDto]', () => {
  it('Should validate all fields successfully', async () => {
    const updatePasswordDto = plainToInstance(
      UpdateForgotPasswordDto,
      UPDATE_PASSWORD,
    );

    const errors = await validate(updatePasswordDto, {
      stopAtFirstError: true,
    });

    expect(errors.length).toBe(0);
  });

  describe('[UpdateForgotPasswordDto] [forgotPasswordCode]', () => {
    it('Should not accept an empty value', async () => {
      const updatePasswordData = { ...UPDATE_PASSWORD };

      delete updatePasswordData.forgotPasswordCode;

      const data = plainToInstance(UpdateForgotPasswordDto, updatePasswordData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('forgotPasswordCode');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'forgotPasswordCode should not be empty',
      });
    });

    it('Should only accept string values', async () => {
      const updatePasswordData = {
        password: UPDATE_PASSWORD.password,
        forgotPasswordCode: 123456,
      };

      const data = plainToInstance(UpdateForgotPasswordDto, updatePasswordData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('forgotPasswordCode');
      expect(errors[0].constraints).toEqual({
        isString: 'forgotPasswordCode must be a string',
      });
    });
  });

  describe('[UpdateForgotPasswordDto] [password]', () => {
    it('Should not accept an empty value', async () => {
      const updatePasswordData = { ...UPDATE_PASSWORD };

      delete updatePasswordData.password;

      const data = plainToInstance(UpdateForgotPasswordDto, updatePasswordData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('password');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'password should not be empty',
      });
    });

    it('Should not accept less than 8 characters', async () => {
      const updatePasswordData = { ...UPDATE_PASSWORD };

      updatePasswordData.password = 'AA';

      const data = plainToInstance(UpdateForgotPasswordDto, updatePasswordData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('password');
      expect(errors[0].constraints).toEqual({
        minLength: 'password must have min 8 characters',
      });
    });

    it('Should not accept more than 50 characters', async () => {
      const updatePasswordData = { ...UPDATE_PASSWORD };

      updatePasswordData.password = 'A'.repeat(51);

      const data = plainToInstance(UpdateForgotPasswordDto, updatePasswordData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('password');
      expect(errors[0].constraints).toEqual({
        maxLength: 'password must have max 50 characters',
      });
    });

    it('Should only accept string values', async () => {
      const updatePasswordData = {
        password: 123,
        forgotPasswordCode: '123456',
      };

      const data = plainToInstance(UpdateForgotPasswordDto, updatePasswordData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('password');
      expect(errors[0].constraints).toEqual({
        isString: 'password must be a string',
      });
    });

    it('Regex used for password property force to include at least one digit and one symbol', async () => {
      const validExamples: string[] = [
        'Password!1',
        'Password!123',
        'Password!@#123',
      ];

      validExamples.forEach((value) =>
        expect(ACCOUNT_REGEX.PASSWORD.test(value)).toBe(true),
      );

      const invalidExampls: string[] = [
        'NoDigistNoSpecialChartacters',
        'NoSpecialCharacters123',
        'SpecialChars!@#$%',
        '!@#$%',
        '123412234',
        '123412234!@#$%',
      ];

      invalidExampls.forEach((value) =>
        expect(ACCOUNT_REGEX.PASSWORD.test(value)).toBe(false),
      );
    });
  });
});
