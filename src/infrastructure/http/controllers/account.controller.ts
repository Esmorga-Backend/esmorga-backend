import {
  Controller,
  Post,
  HttpException,
  InternalServerErrorException,
  UseFilters,
  Headers,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import {
  LoginService,
  RegisterService,
  RefreshTokenService,
  JoinEventService,
} from '../../../application/handler/account';
import { HttpExceptionFilter } from '../errors';
import {
  AccountLoginDto,
  AccountRegisterDto,
  RefreshTokenDto,
  EventIdDto,
} from '../dtos';
import {
  SwaggerAccountLogin,
  SwaggerAccountRegister,
  SwaggerJoinEvent,
  SwaggerRefreshToken,
} from '../swagger/decorators/account';
import { AccountLoggedDto, NewPairOfTokensDto } from '../../dtos';
import { RequestId } from '../req-decorators';
import { AuthGuard } from '../guards';

@Controller('/v1/account')
@ApiTags('Account')
@UseFilters(new HttpExceptionFilter())
export class AccountController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly joinEventService: JoinEventService,
  ) {}

  @Post('/login')
  @SwaggerAccountLogin()
  @HttpCode(200)
  async login(
    @Body() accountLoginDto: AccountLoginDto,
    @RequestId() requestId: string,
  ): Promise<AccountLoggedDto> {
    try {
      this.logger.info(
        `[AccountController] [login] - x-request-id:${requestId}`,
      );

      const response: AccountLoggedDto = await this.loginService.login(
        accountLoginDto,
        requestId,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `[AccountController] [login] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  @Post('/register')
  @SwaggerAccountRegister()
  async register(
    @Body() accountRegisterDto: AccountRegisterDto,
    @RequestId() requestId: string,
  ): Promise<AccountLoggedDto> {
    try {
      this.logger.info(
        `[AccountController] [register] - x-request-id:${requestId}`,
      );

      const response: AccountLoggedDto = await this.registerService.register(
        accountRegisterDto,
        requestId,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `[AccountController] [register] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  @Post('/refresh')
  @SwaggerRefreshToken()
  @HttpCode(200)
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @RequestId() requestId: string,
  ): Promise<NewPairOfTokensDto> {
    try {
      this.logger.info(
        `[AccountController] [refreshToken] - x-request-id:${requestId}`,
      );

      const response: NewPairOfTokensDto =
        await this.refreshTokenService.refreshToken(refreshTokenDto, requestId);
      return response;
    } catch (error) {
      this.logger.error(
        `[AccountController] [refreshToken] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  @Post('/events')
  @UseGuards(AuthGuard)
  @SwaggerJoinEvent()
  @HttpCode(204)
  async joinEvent(
    @Headers('Authorization') accessToken: string,
    @Body() joinEventDto: EventIdDto,
    @RequestId() requestId: string,
  ) {
    try {
      this.logger.info(
        `[AccountController] [joinEvent] - x-request-id:${requestId}`,
      );

      await this.joinEventService.joinEvent(
        accessToken,
        joinEventDto.eventId,
        requestId,
      );
    } catch (error) {
      this.logger.error(
        `[AccountController] [joinEvent] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
