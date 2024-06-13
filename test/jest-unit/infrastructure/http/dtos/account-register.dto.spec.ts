import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  AccountRegisterDto,
  ACCOUNT_REGISTER_REGEX,
} from '../../../../../src/infrastructure/http/dtos';
import { accountRegister } from '../../../../mocks/dtos';

describe('[unit test] [AccountRegisterDto]', () => {
  describe('[AccountRegisterDto] [name]', () => {
    it('Should not accept an empty value', async () => {
      const accountRegisterData = { ...accountRegister };

      delete accountRegisterData.name;

      const data = plainToInstance(AccountRegisterDto, accountRegisterData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('name');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'name should not be empty',
      });
    });

    it('Should not accept less than 3 characters', async () => {
      const accountRegisterData = { ...accountRegister };

      accountRegisterData.name = 'AA';

      const data = plainToInstance(AccountRegisterDto, accountRegisterData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('name');
      expect(errors[0].constraints).toEqual({
        minLength: 'name must have min 3 characters',
      });
    });

    it('Should not accept more than 100 characters', async () => {
      const accountRegisterData = { ...accountRegister };

      accountRegisterData.name = 'A'.repeat(101);

      const data = plainToInstance(AccountRegisterDto, accountRegisterData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('name');
      expect(errors[0].constraints).toEqual({
        maxLength: 'name must have max 100 characters',
      });
    });

    it('Should only accept string values', async () => {
      const accountRegisterData = {
        name: 123,
        lastName: "O'Donnel-Vic",
        password: 'SuperSecret1!',
        email: 'eventslogin01@yopmail.com',
      };

      const data = plainToInstance(AccountRegisterDto, accountRegisterData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('name');
      expect(errors[0].constraints).toEqual({
        isString: 'name must be a string',
      });
    });

    it(`Should only accept letters (Uppercase or lowercase), spaces and ''',  '-'`, async () => {
      const accountRegisterData = {
        name: 'John@',
        lastName: "O'Donnel-Vic",
        password: 'SuperSecret1!',
        email: 'eventslogin01@yopmail.com',
      };

      const data = plainToInstance(AccountRegisterDto, accountRegisterData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('name');
      expect(errors[0].constraints).toEqual({
        matches:
          "name only accept letters (Uppercase or lowercase), spaces and ''',  '-'",
      });
    });

    it(`Regex used for name property should only accept letters (Uppercase or lowercase), spaces and ''',  '-'`, async () => {
      const validExamples: string[] = [
        'john',
        'JOHN',
        'John',
        `John'`,
        'John-',
        'Jo hn',
      ];

      validExamples.forEach((value) =>
        expect(ACCOUNT_REGISTER_REGEX.NAME.test(value)).toBe(true),
      );

      const invalidExampls: string[] = [
        'John123',
        'John_',
        'John+',
        'John=',
        'John(',
        'John)',
        'John*',
        'John&',
        'John^',
        'John%',
        'John$',
        'John#',
        'John@',
        'John!',
        'John|',
        'John[',
        'John]',
        'John{',
        'John}',
        'John"',
        'John,',
        'John;',
        'John:',
        'John>',
        'John<',
        'John.',
        'John/',
        'John?',
      ];

      invalidExampls.forEach((value) =>
        expect(ACCOUNT_REGISTER_REGEX.NAME.test(value)).toBe(false),
      );
    });
  });

  describe('[AccountRegisterDto] [lastName]', () => {
    it('Should not accept an empty value', async () => {
      const accountRegisterData = { ...accountRegister };

      delete accountRegisterData.lastName;

      const data = plainToInstance(AccountRegisterDto, accountRegisterData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('lastName');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'lastName should not be empty',
      });
    });

    it('Should not accept less than 3 characters', async () => {
      const accountRegisterData = { ...accountRegister };

      accountRegisterData.lastName = 'AA';

      const data = plainToInstance(AccountRegisterDto, accountRegisterData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('lastName');
      expect(errors[0].constraints).toEqual({
        minLength: 'lastName must have min 3 characters',
      });
    });

    it('Should not accept more than 100 characters', async () => {
      const accountRegisterData = { ...accountRegister };

      accountRegisterData.lastName = 'A'.repeat(101);

      const data = plainToInstance(AccountRegisterDto, accountRegisterData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('lastName');
      expect(errors[0].constraints).toEqual({
        maxLength: 'lastName must have max 100 characters',
      });
    });

    it('Should only accept string values', async () => {
      const accountRegisterData = {
        name: 'John',
        lastName: 123,
        password: 'SuperSecret1!',
        email: 'eventslogin01@yopmail.com',
      };

      const data = plainToInstance(AccountRegisterDto, accountRegisterData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('lastName');
      expect(errors[0].constraints).toEqual({
        isString: 'lastName must be a string',
      });
    });

    it(`Should only accept letters (Uppercase or lowercase), spaces and ''',  '-'`, async () => {
      const accountRegisterData = {
        name: 'John',
        lastName: "O'Donnel-Vic@",
        password: 'SuperSecret1!',
        email: 'eventslogin01@yopmail.com',
      };

      const data = plainToInstance(AccountRegisterDto, accountRegisterData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('lastName');
      expect(errors[0].constraints).toEqual({
        matches:
          "lastName only accept letters (Uppercase or lowercase), spaces and ''',  '-'",
      });
    });
  });

  describe('[AccountRegisterDto] [password]', () => {
    it('Should not accept an empty value', async () => {
      const accountRegisterData = { ...accountRegister };

      delete accountRegisterData.password;

      const data = plainToInstance(AccountRegisterDto, accountRegisterData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('password');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'password should not be empty',
      });
    });

    it('Should not accept less than 8 characters', async () => {
      const accountRegisterData = { ...accountRegister };

      accountRegisterData.password = 'AA';

      const data = plainToInstance(AccountRegisterDto, accountRegisterData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('password');
      expect(errors[0].constraints).toEqual({
        minLength: 'password must have min 8 characters',
      });
    });

    it('Should not accept more than 50 characters', async () => {
      const accountRegisterData = { ...accountRegister };

      accountRegisterData.password = 'A'.repeat(51);

      const data = plainToInstance(AccountRegisterDto, accountRegisterData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('password');
      expect(errors[0].constraints).toEqual({
        maxLength: 'password must have max 50 characters',
      });
    });

    it('Should only accept string values', async () => {
      const accountRegisterData = {
        name: 'John',
        lastName: "O'Donnel-Vic",
        password: 123,
        email: 'eventslogin01@yopmail.com',
      };

      const data = plainToInstance(AccountRegisterDto, accountRegisterData);

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
        expect(ACCOUNT_REGISTER_REGEX.PASSWORD.test(value)).toBe(true),
      );

      const invalidExampls: string[] = [
        'NoDigistNoSpecialChartacters',
        'NoSpecialCharacters123',
        'OnlySpecialChars!@#$%',
      ];

      invalidExampls.forEach((value) =>
        expect(ACCOUNT_REGISTER_REGEX.PASSWORD.test(value)).toBe(false),
      );
    });
  });
});
