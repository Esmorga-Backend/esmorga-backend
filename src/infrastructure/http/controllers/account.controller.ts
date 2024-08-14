import {
  Controller,
  Get,
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
  GetMyEventsService,
} from '../../../application/handler/account';
import { HttpExceptionFilter } from '../filters';
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
  SwaggetGetMyEvents,
} from '../swagger/decorators/account';
import { AccountLoggedDto, NewPairOfTokensDto, EventListDto } from '../../dtos';
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
    private readonly getMyEventsService: GetMyEventsService,
  ) {}

  @Get('/events')
  @UseGuards(AuthGuard)
  @SwaggetGetMyEvents()
  async getMyEvents(
    @Headers('Authorization') accessToken: string,
    @RequestId() requestId: string,
  ): Promise<EventListDto> {
    try {
      this.logger.info(
        `[AccountController] [getMyEvents] - x-request-id:${requestId}`,
      );

      const response: EventListDto = await this.getMyEventsService.getEvents(
        accessToken,
        requestId,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `[AccountController] [getMyEvents] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

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

      const response = await this.refreshTokenService.refreshToken(
        refreshTokenDto,
        requestId,
      );
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
