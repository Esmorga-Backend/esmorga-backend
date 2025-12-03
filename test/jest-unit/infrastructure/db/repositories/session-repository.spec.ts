import { PinoLogger } from 'nestjs-pino';
import { SessionRepository } from '../../../../../src/infrastructure/db/repositories/session.repository';
import { SessionDA } from '../../../../../src/infrastructure/db/modules/none/session-da';
import {
  DataBaseInternalError,
  DataBaseUnauthorizedError,
} from '../../../../../src/infrastructure/db/errors';
import { SessionDto } from '../../../../../src/infrastructure/dtos/session.dto';
import { SESSION_MOCK_DB } from '../../../../mocks/db/tokens';

const createSessionMock = (): SessionDto => ({
  id: SESSION_MOCK_DB._id,
  uuid: SESSION_MOCK_DB.uuid,
  sessionId: SESSION_MOCK_DB.sessionId,
  refreshTokenId: SESSION_MOCK_DB.refreshTokenId,
  createdAt: SESSION_MOCK_DB.createdAt,
  updatedAt: SESSION_MOCK_DB.updatedAt,
});

describe('[unit-test] [SessionRepository]', () => {
  let sessionDA: jest.Mocked<SessionDA>;
  let logger: PinoLogger;
  let repository: SessionRepository;

  beforeEach(() => {
    sessionDA = {
      create: jest.fn(),
      findByUuid: jest.fn(),
      findOneBySessionId: jest.fn(),
      updateById: jest.fn(),
      removeAllByUuid: jest.fn(),
      removeById: jest.fn(),
      removeBySessionId: jest.fn(),
    } as jest.Mocked<SessionDA>;

    logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as PinoLogger;

    repository = new SessionRepository(sessionDA, logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('[saveSession]', () => {
    it('stores the session data', async () => {
      sessionDA.create.mockResolvedValue(undefined);

      await repository.saveSession('uuid', 'sessionId', 'refreshTokenId');

      expect(sessionDA.create).toHaveBeenCalledWith(
        'uuid',
        'sessionId',
        'refreshTokenId',
      );
    });

    it('throws DataBaseInternalError', async () => {
      sessionDA.create.mockRejectedValue(new Error('Internal database error'));

      await expect(
        repository.saveSession('uuid', 'sessionId', 'refreshTokenId'),
      ).rejects.toBeInstanceOf(DataBaseInternalError);
    });
  });

  describe('[getAllTokensByUuid]', () => {
    it('returns the stored sessions for the user', async () => {
      const session = createSessionMock();
      sessionDA.findByUuid.mockResolvedValue([session]);

      const result = await repository.getAllTokensByUuid('uuid');

      expect(result).toEqual([session]);
      expect(sessionDA.findByUuid).toHaveBeenCalledWith('uuid');
    });

    it('throws DataBaseInternalError', async () => {
      sessionDA.findByUuid.mockRejectedValue(
        new Error('Internal database error'),
      );

      await expect(
        repository.getAllTokensByUuid('uuid'),
      ).rejects.toBeInstanceOf(DataBaseInternalError);
    });
  });

  describe('[getBySessionId]', () => {
    it('returns session data when it exists', async () => {
      const session = createSessionMock();
      sessionDA.findOneBySessionId.mockResolvedValue(session);

      const result = await repository.getBySessionId('sessionId');

      expect(result).toBe(session);
      expect(sessionDA.findOneBySessionId).toHaveBeenCalledWith('sessionId');
    });

    it('throws DataBaseUnauthorizedError when session does not exist', async () => {
      sessionDA.findOneBySessionId.mockResolvedValue(null);

      await expect(
        repository.getBySessionId('sessionId'),
      ).rejects.toBeInstanceOf(DataBaseUnauthorizedError);
    });

    it('throws DataBaseInternalError', async () => {
      sessionDA.findOneBySessionId.mockRejectedValue(
        new Error('Internal database error'),
      );

      await expect(
        repository.getBySessionId('sessionId'),
      ).rejects.toBeInstanceOf(DataBaseInternalError);
    });
  });

  describe('[removeTokensById]', () => {
    it('removes the session by document id', async () => {
      sessionDA.removeById.mockResolvedValue(undefined);

      await repository.removeTokensById('id');

      expect(sessionDA.removeById).toHaveBeenCalledWith('id');
    });

    it('throws DataBaseInternalError if the removal fails', async () => {
      sessionDA.removeById.mockRejectedValue(
        new Error('Internal database error'),
      );

      await expect(repository.removeTokensById('id')).rejects.toBeInstanceOf(
        DataBaseInternalError,
      );
    });
  });

  describe('[removeAllSessionsByUuid]', () => {
    it('removes all sessions except the current one', async () => {
      sessionDA.removeAllByUuid.mockResolvedValue(undefined);

      await repository.removeAllSessionsByUuid('uuid', 'sessionId');

      expect(sessionDA.removeAllByUuid).toHaveBeenCalledWith(
        'uuid',
        'sessionId',
      );
    });

    it('throws DataBaseInternalError when operation fails', async () => {
      sessionDA.removeAllByUuid.mockRejectedValue(
        new Error('Internal database error'),
      );

      await expect(
        repository.removeAllSessionsByUuid('uuid', 'sessionId'),
      ).rejects.toBeInstanceOf(DataBaseInternalError);
    });
  });

  describe('[removeTokensBySessionId]', () => {
    it('removes the session by session id', async () => {
      sessionDA.removeBySessionId.mockResolvedValue(undefined);

      await repository.removeTokensBySessionId('sessionId');

      expect(sessionDA.removeBySessionId).toHaveBeenCalledWith('sessionId');
    });

    it('throws DataBaseInternalError when the removal fails', async () => {
      sessionDA.removeBySessionId.mockRejectedValue(
        new Error('Internal database error'),
      );

      await expect(
        repository.removeTokensBySessionId('sessionId'),
      ).rejects.toBeInstanceOf(DataBaseInternalError);
    });
  });

  describe('[updateRefreshTokenId]', () => {
    it('updates the refresh token id for the session', async () => {
      sessionDA.updateById.mockResolvedValue(undefined);

      await repository.updateRefreshTokenId('sessionId', 'refreshTokenId');

      expect(sessionDA.updateById).toHaveBeenCalledWith('sessionId', {
        refreshTokenId: 'refreshTokenId',
      });
    });

    it('throws DataBaseInternalError when the update fails', async () => {
      sessionDA.updateById.mockRejectedValue(
        new Error('Internal database error'),
      );

      await expect(
        repository.updateRefreshTokenId('sessionId', 'refreshTokenId'),
      ).rejects.toBeInstanceOf(DataBaseInternalError);
    });
  });
});
