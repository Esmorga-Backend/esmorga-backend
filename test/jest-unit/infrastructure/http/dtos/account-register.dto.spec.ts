import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  AccountRegisterDto,
  ACCOUNT_REGISTER_REGEX,
} from '../../../../../src/infrastructure/http/dtos';
import { ACCOUNT_REGISTER } from '../../../../mocks/dtos';

describe('[unit test] [AccountRegisterDto]', () => {
  describe('[AccountRegisterDto] [name]', () => {
    it('Should not accept an empty value', async () => {
      const accountRegisterData = { ...ACCOUNT_REGISTER };

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
      const accountRegisterData = { ...ACCOUNT_REGISTER };

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
      const accountRegisterData = { ...ACCOUNT_REGISTER };

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
      const accountRegisterData = { ...ACCOUNT_REGISTER };

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
      const accountRegisterData = { ...ACCOUNT_REGISTER };

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
      const accountRegisterData = { ...ACCOUNT_REGISTER };

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

  describe('[AccountRegisterDto] [email]', () => {
    it('Should not accept an empty value', async () => {
      const accountRegisterData = { ...ACCOUNT_REGISTER };

      delete accountRegisterData.email;

      const data = plainToInstance(AccountRegisterDto, accountRegisterData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('email');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'email should not be empty',
      });
    });

    it('Should not accept more than 100 characters', async () => {
      const accountRegisterData = { ...ACCOUNT_REGISTER };

      accountRegisterData.email = 'A'.repeat(101);

      const data = plainToInstance(AccountRegisterDto, accountRegisterData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('email');
      expect(errors[0].constraints).toEqual({
        maxLength: 'email must have max 100 characters',
      });
    });

    it('Should only accept string values', async () => {
      const accountRegisterData = {
        name: 'John',
        lastName: "O'Donnel-Vic",
        password: 'Password!1',
        email: 123,
      };

      const data = plainToInstance(AccountRegisterDto, accountRegisterData);

      const errors = await validate(data, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('email');
      expect(errors[0].constraints).toEqual({
        isString: 'email must be a string',
      });
    });

    it('Regex used should not accept +, spaces and after the @ only letters (Uppercase or lowercase) and digits are allowed, _ - ', async () => {
      const validExamples: string[] = [
        'eventslogin01@yopmail.com',
        'eventslogin01.name123@yopmail.co.es',
        'another-eventslogin01@sub.domain.yopmail.net',
        'events_login01@yopmail.org',
        '1234@yopmail.com',
      ];

      validExamples.forEach((value) =>
        expect(ACCOUNT_REGISTER_REGEX.EMAIL.test(value)).toBe(true),
      );

      const invalidExampls: string[] = [
        'eventslogin01+alias@yopmail.com',
        'events login01@yopmail.com',
        'eventslogin01@invalid domainYopmail.com',
        'invalidemail',
        '@yopmail.com',
        'eventslogin01@yopmail',
      ];

      invalidExampls.forEach((value) =>
        expect(ACCOUNT_REGISTER_REGEX.EMAIL.test(value)).toBe(false),
      );
    });

    it('Should handle the value in lower case', async () => {
      const accountRegisterData = {
        name: 'John',
        lastName: "O'Donnel-Vic",
        password: 'Password!1',
        email: 'EVENTSLOGIN04@yopmail.com',
      };

      const data = plainToInstance(AccountRegisterDto, accountRegisterData);

      expect(data.email).toBe(accountRegisterData.email.toLowerCase());
    });
  });

  describe('[AccountRegisterDto] [password]', () => {
    it('Should not accept an empty value', async () => {
      const accountRegisterData = { ...ACCOUNT_REGISTER };

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
      const accountRegisterData = { ...ACCOUNT_REGISTER };

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
      const accountRegisterData = { ...ACCOUNT_REGISTER };

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
        'a1!',
      ];

      validExamples.forEach((value) =>
        expect(ACCOUNT_REGISTER_REGEX.PASSWORD.test(value)).toBe(true),
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
        expect(ACCOUNT_REGISTER_REGEX.PASSWORD.test(value)).toBe(false),
      );
    });
  });
});
