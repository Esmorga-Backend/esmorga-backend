import { ExecutionContext } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { OptionalAuthGuard } from '../../../../../src/infrastructure/http/guards/optional-auth.guard';
import { AuthGuard } from '../../../../../src/infrastructure/http/guards/auth.guard';

describe('[unit-test] [OptionalAuthGuard]', () => {
  let optionalAuthGuard: OptionalAuthGuard;
  let logger: jest.Mocked<PinoLogger>;
  let authGuard: jest.Mocked<AuthGuard>;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;

  beforeEach(() => {
    logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<PinoLogger>;

    authGuard = {
      canActivate: jest.fn(),
    } as unknown as jest.Mocked<AuthGuard>;

    optionalAuthGuard = new OptionalAuthGuard(logger, authGuard);

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {},
        }),
      }),
    } as unknown as jest.Mocked<ExecutionContext>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when no authorization header is present', async () => {
    const mockRequest = {
      headers: {
        'x-request-id': 'test-request-id',
      },
    };

    mockExecutionContext.switchToHttp = jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    });

    const result = await optionalAuthGuard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(logger.info).toHaveBeenCalledWith(
      '[OptionalAuthGuard] - x-request-id:test-request-id',
    );
    expect(logger.info).toHaveBeenCalledWith(
      '[OptionalAuthGuard] - x-request-id:test-request-id - No authorization header, skipping auth',
    );
    expect(authGuard.canActivate).not.toHaveBeenCalled();
  });

  it('should return true when authorization header is undefined', async () => {
    const mockRequest = {
      headers: {
        authorization: undefined,
        'x-request-id': 'test-request-id-2',
      },
    };

    mockExecutionContext.switchToHttp = jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    });

    const result = await optionalAuthGuard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(logger.info).toHaveBeenCalledWith(
      '[OptionalAuthGuard] - x-request-id:test-request-id-2',
    );
    expect(logger.info).toHaveBeenCalledWith(
      '[OptionalAuthGuard] - x-request-id:test-request-id-2 - No authorization header, skipping auth',
    );
    expect(authGuard.canActivate).not.toHaveBeenCalled();
  });

  it('should call authGuard.canActivate when authorization header is present', async () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer valid-token',
        'x-request-id': 'test-request-id-3',
      },
    };

    mockExecutionContext.switchToHttp = jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    });

    authGuard.canActivate.mockResolvedValue(true);

    const result = await optionalAuthGuard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(logger.info).toHaveBeenCalledWith(
      '[OptionalAuthGuard] - x-request-id:test-request-id-3',
    );
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(authGuard.canActivate).toHaveBeenCalledWith(mockExecutionContext);
  });

  it('should return false when authGuard.canActivate returns false', async () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer invalid-token',
        'x-request-id': 'test-request-id-4',
      },
    };

    mockExecutionContext.switchToHttp = jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    });

    authGuard.canActivate.mockResolvedValue(false);

    const result = await optionalAuthGuard.canActivate(mockExecutionContext);

    expect(result).toBe(false);
    expect(authGuard.canActivate).toHaveBeenCalledWith(mockExecutionContext);
  });

  it('should propagate errors thrown by authGuard.canActivate', async () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer malformed-token',
        'x-request-id': 'test-request-id-5',
      },
    };

    mockExecutionContext.switchToHttp = jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    });

    const mockError = new Error('Invalid token');
    authGuard.canActivate.mockRejectedValue(mockError);

    await expect(
      optionalAuthGuard.canActivate(mockExecutionContext),
    ).rejects.toThrow('Invalid token');

    expect(authGuard.canActivate).toHaveBeenCalledWith(mockExecutionContext);
  });

  it('should handle missing x-request-id header gracefully', async () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };

    mockExecutionContext.switchToHttp = jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    });

    authGuard.canActivate.mockResolvedValue(true);

    const result = await optionalAuthGuard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(logger.info).toHaveBeenCalledWith(
      '[OptionalAuthGuard] - x-request-id:undefined',
    );
    expect(authGuard.canActivate).toHaveBeenCalledWith(mockExecutionContext);
  });

  it('should handle empty string authorization header as no authorization', async () => {
    const mockRequest = {
      headers: {
        authorization: '',
        'x-request-id': 'test-request-id-6',
      },
    };

    mockExecutionContext.switchToHttp = jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    });

    const result = await optionalAuthGuard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(logger.info).toHaveBeenCalledWith(
      '[OptionalAuthGuard] - x-request-id:test-request-id-6 - No authorization header, skipping auth',
    );
    expect(authGuard.canActivate).not.toHaveBeenCalled();
  });
});
