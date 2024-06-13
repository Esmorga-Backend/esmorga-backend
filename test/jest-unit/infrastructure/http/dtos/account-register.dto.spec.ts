import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AccountRegisterDto } from '../../../../../src/infrastructure/http/dtos';
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
  });
});
