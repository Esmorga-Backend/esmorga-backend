import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { EmailDto } from '../../../../../src/infrastructure/http/dtos';
import { EMAIL_MOCK } from '../../../../mocks/dtos';

describe('[unit-test] [EmailDto]', () => {
  it('Should validate all fields successfully', async () => {
    const emailDto = plainToInstance(EmailDto, EMAIL_MOCK);

    const errors = await validate(emailDto, {
      stopAtFirstError: true,
    });

    expect(errors.length).toBe(0);
  });

  describe('[EmailDto] [email]', () => {
    it('Should not accept empty value', async () => {
      const emailData = { ...EMAIL_MOCK };

      delete emailData.email;

      const emailDto = plainToInstance(EmailDto, emailData);

      const errors = await validate(emailDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('email');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'email should not be empty',
      });
    });

    it('Should only accept string values', async () => {
      const emailData: any = { ...EMAIL_MOCK };

      emailData.email = 123;

      const emailDto = plainToInstance(EmailDto, emailData);

      const errors = await validate(emailDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('email');
      expect(errors[0].constraints).toEqual({
        isString: 'email must be a string',
      });
    });
  });
});
