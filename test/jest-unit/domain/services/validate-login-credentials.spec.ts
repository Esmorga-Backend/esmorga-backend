import { createHash } from 'crypto';
import { validateLoginCredentials } from '../../../../src/domain/services';
import { InvalidCredentialsLoginApiError } from '../../../../src/domain/errors';

const PASSWORD = 'Password1';

const DB_PASSWORD = createHash('sha256').update(PASSWORD).digest('hex');

describe('[unit-test] [validateLoginCredentials]', () => {
  it('Should not throw an error if passwords match', () => {
    expect(() => validateLoginCredentials(DB_PASSWORD, PASSWORD)).not.toThrow();
  });

  it('Should thow an error if passowords do not match', () => {
    expect(() => validateLoginCredentials(DB_PASSWORD, 'passwordFake')).toThrow(
      InvalidCredentialsLoginApiError,
    );
  });

  it('Should throw an error if database password is not defined', () => {
    expect(() => validateLoginCredentials(null, PASSWORD)).toThrow(
      InvalidCredentialsLoginApiError,
    );
  });
});
