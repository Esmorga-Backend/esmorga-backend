import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import {
  AccountRepository,
  LoginAttemptsRepository,
} from '../../../../src/infrastructure/db/repositories';
import { ValidateLoginCredentialsService } from '../../../../src/domain/services/validate-login-credentials';
import {
  BlockedUserApiError,
  InvalidCredentialsLoginApiError,
  UnverifiedUserApiError,
} from '../../../../src/domain/errors';
import { ACCOUNT_STATUS } from '../../../../src/domain/const';

describe('[unit-test] [ValidateLoginCredentialsService]', () => {
  let service: ValidateLoginCredentialsService;
  let accountRepository: AccountRepository;
  let loginAttemptsRepository: LoginAttemptsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateLoginCredentialsService,
        {
          provide: AccountRepository,
          useValue: {
            blockAccountByUuid: jest.fn(),
          },
        },
        {
          provide: LoginAttemptsRepository,
          useValue: {
            updateLoginAttempts: jest.fn(),
            removeLoginAttempts: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(5),
          },
        },
      ],
    }).compile();

    service = module.get<ValidateLoginCredentialsService>(
      ValidateLoginCredentialsService,
    );
    accountRepository = module.get<AccountRepository>(AccountRepository);
    loginAttemptsRepository = module.get<LoginAttemptsRepository>(
      LoginAttemptsRepository,
    );
  });

  describe('validateLoginCredentials', () => {
    const uuid = 'userId';

    it('validates credentials with argon2 password', async () => {
      const password = 'Password!1';
      const hashedPassword = await argon2.hash(password);

      await service.validateLoginCredentials(
        uuid,
        hashedPassword,
        password,
        ACCOUNT_STATUS.ACTIVE,
      );

      expect(true).toBe(true);
    });

    it('validates credentials with SHA256 password', async () => {
      const password = 'Password!1';
      const hashedPassword = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex');

      await service.validateLoginCredentials(
        uuid,
        hashedPassword,
        password,
        ACCOUNT_STATUS.ACTIVE,
      );

      expect(true).toBe(true);
    });

    it('throws InvalidCredentialsLoginApiError when password is incorrect', async () => {
      const correctPassword = 'Password!1';
      const wrongPassword = 'WrongPassword!1';
      const hashedPassword = await argon2.hash(correctPassword);

      jest
        .spyOn(loginAttemptsRepository, 'updateLoginAttempts')
        .mockResolvedValue(1);

      await expect(
        service.validateLoginCredentials(
          uuid,
          hashedPassword,
          wrongPassword,
          ACCOUNT_STATUS.ACTIVE,
        ),
      ).rejects.toThrow(InvalidCredentialsLoginApiError);
    });

    it('throws UnverifiedUserApiError when account is UNVERIFIED', async () => {
      const password = 'Password!1';
      const hashedPassword = await argon2.hash(password);

      await expect(
        service.validateLoginCredentials(
          uuid,
          hashedPassword,
          password,
          ACCOUNT_STATUS.UNVERIFIED,
        ),
      ).rejects.toThrow(UnverifiedUserApiError);
    });

    it('throws BlockedUserApiError when account is BLOCKED', async () => {
      const password = 'Password!1';
      const hashedPassword = await argon2.hash(password);

      await expect(
        service.validateLoginCredentials(
          uuid,
          hashedPassword,
          password,
          ACCOUNT_STATUS.BLOCKED,
        ),
      ).rejects.toThrow(BlockedUserApiError);
    });

    it('blocks account after 5 failed login attempts', async () => {
      const correctPassword = 'Password!1';
      const wrongPassword = 'WrongPassword!1';
      const hashedPassword = await argon2.hash(correctPassword);

      jest
        .spyOn(loginAttemptsRepository, 'updateLoginAttempts')
        .mockResolvedValue(5);

      jest.spyOn(accountRepository, 'blockAccountByUuid').mockResolvedValue();
      jest
        .spyOn(loginAttemptsRepository, 'removeLoginAttempts')
        .mockResolvedValue();

      await expect(
        service.validateLoginCredentials(
          uuid,
          hashedPassword,
          wrongPassword,
          ACCOUNT_STATUS.ACTIVE,
        ),
      ).rejects.toThrow(InvalidCredentialsLoginApiError);

      expect(accountRepository.blockAccountByUuid).toHaveBeenCalledWith(
        uuid,
        undefined,
      );
      expect(loginAttemptsRepository.removeLoginAttempts).toHaveBeenCalledWith(
        uuid,
        undefined,
      );
    });

    it('increments login attempts before the max is reached', async () => {
      const correctPassword = 'Password!1';
      const wrongPassword = 'WrongPassword!1';
      const hashedPassword = await argon2.hash(correctPassword);

      jest
        .spyOn(loginAttemptsRepository, 'updateLoginAttempts')
        .mockResolvedValue(3);

      jest.spyOn(accountRepository, 'blockAccountByUuid').mockResolvedValue();

      await expect(
        service.validateLoginCredentials(
          uuid,
          hashedPassword,
          wrongPassword,
          ACCOUNT_STATUS.ACTIVE,
        ),
      ).rejects.toThrow(InvalidCredentialsLoginApiError);

      expect(loginAttemptsRepository.updateLoginAttempts).toHaveBeenCalledWith(
        uuid,
        undefined,
      );
      expect(accountRepository.blockAccountByUuid).not.toHaveBeenCalled();
    });
  });
});
