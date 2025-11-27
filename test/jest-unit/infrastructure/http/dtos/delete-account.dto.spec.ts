import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DeleteAccountDto } from '../../../../../src/infrastructure/http/dtos';
import { DELETE_ACCOUNT } from '../../../../mocks/dtos';
import { ACCOUNT_REGEX } from '../../../../../src/domain/regex';

describe('[unit-test] [DeleteAccountDto]', () => {
  it('Should validate all fields successfully', async () => {
    const deleteAccountDto = plainToInstance(DeleteAccountDto, DELETE_ACCOUNT);

    const errors = await validate(deleteAccountDto, {
      stopAtFirstError: true,
    });

    expect(errors.length).toBe(0);
  });

  it('Should not accept an empty value', async () => {
    const deleteAccountData = { ...DELETE_ACCOUNT };

    delete deleteAccountData.password;

    const data = plainToInstance(DeleteAccountDto, deleteAccountData);

    const errors = await validate(data, { stopAtFirstError: true });

    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('password');
    expect(errors[0].constraints).toEqual({
      isNotEmpty: 'password should not be empty',
    });
  });

  it('Should only accept string values', async () => {
    const deleteAccountData = {
      ...DELETE_ACCOUNT,
      password: 123456,
    };

    const data = plainToInstance(DeleteAccountDto, deleteAccountData);

    const errors = await validate(data, { stopAtFirstError: true });

    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('password');
    expect(errors[0].constraints).toEqual({
      isString: 'password must be a string',
    });
  });

  it('Should not accept less than 8 characters', async () => {
    const deleteAccountData = { ...DELETE_ACCOUNT };

    deleteAccountData.password = 'AA';

    const data = plainToInstance(DeleteAccountDto, deleteAccountData);
    const errors = await validate(data, { stopAtFirstError: true });

    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('password');
    expect(errors[0].constraints).toEqual({
      minLength: 'password must have min 8 characters',
    });
  });

  it('Should not accept more than 50 characters', async () => {
    const deleteAccountData = { ...DELETE_ACCOUNT };

    deleteAccountData.password = 'A'.repeat(51);

    const data = plainToInstance(DeleteAccountDto, deleteAccountData);
    const errors = await validate(data, { stopAtFirstError: true });

    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('password');
    expect(errors[0].constraints).toEqual({
      maxLength: 'password must have max 50 characters',
    });
  });
});
