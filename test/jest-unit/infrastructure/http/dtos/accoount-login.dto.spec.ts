import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AccountLoginDto } from '../../../../../src/infrastructure/dtos';

const ACCOUNT_LOGIN_MOCK: AccountLoginDto = {
  email: 'esmorga.test.01@yopmail.com',
  password: 'Password01',
};

describe('[unit-test] [AccountLoginDto]', () => {
  it('Should validate all fields successfully', async () => {
    const accountLoginDto = plainToInstance(
      AccountLoginDto,
      ACCOUNT_LOGIN_MOCK,
    );

    const errors = await validate(accountLoginDto, { stopAtFirstError: true });

    expect(errors.length).toBe(0);
  });

  describe('[AccountLoginDto] [email]', () => {
    it('Should not accept empty email', async () => {
      const accountLoginData = { ...ACCOUNT_LOGIN_MOCK };

      delete accountLoginData.email;

      const accountLoginDto = plainToInstance(
        AccountLoginDto,
        accountLoginData,
      );

      const errors = await validate(accountLoginDto, {
        stopAtFirstError: true,
      });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('email');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'email should not be empty',
      });
    });

    it('Should only accept string values for email field', async () => {
      const accountLoginData = {
        email: 123,
        password: 'Password01',
      };

      const accountLoginDto = plainToInstance(
        AccountLoginDto,
        accountLoginData,
      );

      const errors = await validate(accountLoginDto, {
        stopAtFirstError: true,
      });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('email');
      expect(errors[0].constraints).toEqual({
        isString: 'email must be a string',
      });
    });
  });

  describe('[AccountLoginDto] [password]', () => {
    it('Should not accept empty password', async () => {
      const accountLoginData = { ...ACCOUNT_LOGIN_MOCK };

      delete accountLoginData.password;

      const accountLoginDto = plainToInstance(
        AccountLoginDto,
        accountLoginData,
      );

      const errors = await validate(accountLoginDto, {
        stopAtFirstError: true,
      });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('password');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'password should not be empty',
      });
    });

    it('Should only accept string values for password field', async () => {
      const accountLoginData = {
        email: 'esmorga.test.01@yopmail.com',
        password: 123,
      };

      const accountLoginDto = plainToInstance(
        AccountLoginDto,
        accountLoginData,
      );

      const errors = await validate(accountLoginDto, {
        stopAtFirstError: true,
      });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('password');
      expect(errors[0].constraints).toEqual({
        isString: 'password must be a string',
      });
    });
  });
});
