import {
  Controller,
  Post,
  HttpException,
  InternalServerErrorException,
  UseFilters,
  Body,
  HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import {
  LoginService,
  RegisterService,
  RefreshTokenService,
} from '../../../application/handler/account';
import { HttpExceptionFilter } from '../errors';
import { AccountLoginDto, AccountRegisterDto, RefreshTokenDto } from '../dtos';
import {
  SwaggerAccountLogin,
  SwaggerAccountRegister,
  SwaggerRefreshToken,
} from '../swagger/decorators/account';
import { AccountLoggedDto, NewPairOfTokensDto } from '../../dtos';
import { RequestId } from '../req-decorators';

@Controller('/v1/account')
@ApiTags('Account')
@UseFilters(new HttpExceptionFilter())
export class AccountController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
    private readonly refreshTokenService: RefreshTokenService,
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
}
