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
  Delete,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { PinoLogger } from 'nestjs-pino';
import {
  ActivateAccountService,
  DisjoinEventService,
  UpdatePasswordService,
  ForgotPasswordService,
  GetMyEventsService,
  JoinEventService,
  LoginService,
  RefreshTokenService,
  RegisterService,
  SendEmailVerificationService,
} from '../../../application/handler/account';
import { HttpExceptionFilter } from '../errors';
import {
  AccountLoginDto,
  AccountRegisterDto,
  UpdatePasswordDto,
  ActivateAccountDto,
  EmailDto,
  EventIdDto,
  RefreshTokenDto,
} from '../dtos';
import {
  SwaggerAccountLogin,
  SwaggerActivateAccount,
  SwaggerAccountRegister,
  SwaggerDisjoinEvent,
  SwaggerForgotPassword,
  SwaggerForgotPasswordUpdate,
  SwaggerGetMyEvents,
  SwaggerJoinEvent,
  SwaggerRefreshToken,
  SwaggerSendEmailVerification,
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
    private readonly activateAccountService: ActivateAccountService,
    private readonly disjoinEventService: DisjoinEventService,
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly getMyEventsService: GetMyEventsService,
    private readonly joinEventService: JoinEventService,
    private readonly loginService: LoginService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly registerService: RegisterService,
    private readonly sendEmailVerificationService: SendEmailVerificationService,
    private readonly updatePasswordService: UpdatePasswordService,
  ) {}

  @Get('/events')
  @UseGuards(AuthGuard)
  @SwaggerGetMyEvents()
  async getMyEvents(
    @Headers('Authorization') accessToken: string,
    @RequestId() requestId: string,
  ): Promise<EventListDto> {
    try {
      this.logger.info(
        `[AccountController] [getMyEvents] - x-request-id: ${requestId}`,
      );

      const response: EventListDto = await this.getMyEventsService.getEvents(
        accessToken,
        requestId,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `[AccountController] [getMyEvents] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  @SkipThrottle({ public: false, default: true })
  @Post('/login')
  @SwaggerAccountLogin()
  @HttpCode(200)
  async login(
    @Body() accountLoginDto: AccountLoginDto,
    @RequestId() requestId: string,
  ): Promise<AccountLoggedDto> {
    try {
      this.logger.info(
        `[AccountController] [login] - x-request-id: ${requestId}`,
      );

      const response: AccountLoggedDto = await this.loginService.login(
        accountLoginDto,
        requestId,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `[AccountController] [login] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  @SkipThrottle({ default: true, public: false })
  @Post('/register')
  @SwaggerAccountRegister()
  async register(
    @Body() accountRegisterDto: AccountRegisterDto,
    @RequestId() requestId: string,
  ) {
    try {
      this.logger.info(
        `[AccountController] [register] - x-request-id: ${requestId}`,
      );

      await this.registerService.register(accountRegisterDto, requestId);
    } catch (error) {
      this.logger.error(
        `[AccountController] [register] - x-request-id: ${requestId}, error: ${error}`,
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
        `[AccountController] [refreshToken] - x-request-id: ${requestId}, error: ${error}`,
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
    @Body() eventIdDto: EventIdDto,
    @RequestId() requestId: string,
  ) {
    try {
      this.logger.info(
        `[AccountController] [joinEvent] - x-request-id: ${requestId}`,
      );

      await this.joinEventService.joinEvent(
        accessToken,
        eventIdDto.eventId,
        requestId,
      );
    } catch (error) {
      this.logger.error(
        `[AccountController] [joinEvent] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  @SkipThrottle({ public: false, default: true })
  @Put('/activate')
  @SwaggerActivateAccount()
  @HttpCode(200)
  async activate(
    @Body() activateAccountDto: ActivateAccountDto,
    @RequestId() requestId: string,
  ): Promise<AccountLoggedDto> {
    try {
      this.logger.info(
        `[AccountController] [activate] - x-request-id: ${requestId}`,
      );

      const response: AccountLoggedDto =
        await this.activateAccountService.activate(
          activateAccountDto.verificationCode,
          requestId,
        );

      return response;
    } catch (error) {
      this.logger.error(
        `[AccountController] [activate] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  @Delete('/events')
  @UseGuards(AuthGuard)
  @SwaggerDisjoinEvent()
  @HttpCode(204)
  async disJoinEvent(
    @Headers('Authorization') accessToken: string,
    @Body() eventIdDto: EventIdDto,
    @RequestId() requestId: string,
  ) {
    try {
      this.logger.info(
        `[AccountController] [disJoinEvent] - x-request-id: ${requestId}`,
      );

      await this.disjoinEventService.disJoinEvent(
        accessToken,
        eventIdDto.eventId,
        requestId,
      );
    } catch (error) {
      this.logger.error(
        `[AccountController] [disJoinEvent] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  @SkipThrottle({ public: false, default: true })
  @Post('/email/verification')
  @SwaggerSendEmailVerification()
  @HttpCode(204)
  async sendEmailVerification(
    @Body() emailVerificationDto: EmailDto,
    @RequestId() requestId: string,
  ) {
    try {
      this.logger.info(
        `[AccountController] [sendEmailVerification] - x-request-id: ${requestId}`,
      );

      await this.sendEmailVerificationService.sendEmailVerification(
        emailVerificationDto.email,
        requestId,
      );
    } catch (error) {
      this.logger.error(
        `[AccountController] [sendEmailVerification] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  @SkipThrottle({ public: false, default: true })
  @Post('/password/forgot-init')
  @SwaggerForgotPassword()
  @HttpCode(204)
  async forgotPassword(
    @Body() forgotPasswordDto: EmailDto,
    @RequestId() requestId: string,
  ) {
    try {
      this.logger.info(
        `[AccountController] [forgotPassword] - x-request-id: ${requestId}`,
      );

      await this.forgotPasswordService.forgotPassword(
        forgotPasswordDto.email,
        requestId,
      );
    } catch (error) {
      this.logger.error(
        `[AccountController] [forgotPassword] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  @SkipThrottle({ public: false, default: true })
  @Put('/password/forgot-update')
  @SwaggerForgotPasswordUpdate()
  @HttpCode(204)
  async passwordFotgotUpdate(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @RequestId() requestId: string,
  ) {
    try {
      this.logger.info(
        `[AccountController] [passwordFotgotUpdate] - x-request-id: ${requestId}`,
      );

      await this.updatePasswordService.updatePassword(
        updatePasswordDto,
        requestId,
      );
    } catch (error) {
      this.logger.error(
        `[AccountController] [passwordFotgotUpdate] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }
}
