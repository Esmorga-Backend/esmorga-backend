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
import {
  AccountLoggedDto,
  NewRefreshTokenDto,
} from '../../..//infrastructure/dtos';
import {
  LoginService,
  RefreshTokenService,
} from '../../../application/handler/account';
import { HttpExceptionFilter } from '../errors';
import { AccountLoginDto, RefreshTokenDto } from '../dtos';
import {
  SwaggerAccountLogin,
  SwaggerRefreshToken,
} from '../swagger/decorators/account';

@Controller('/v1/account')
@ApiTags('Account')
@UseFilters(new HttpExceptionFilter())
export class AccountController {
  constructor(
    private readonly loginService: LoginService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Post('/login')
  @SwaggerAccountLogin()
  @HttpCode(200)
  async login(
    @Body() accountLoginDto: AccountLoginDto,
  ): Promise<AccountLoggedDto> {
    try {
      const response = await this.loginService.login(accountLoginDto);

      return response;
    } catch (error) {
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
  ): Promise<NewRefreshTokenDto> {
    try {
      const response =
        await this.refreshTokenService.refreshToken(refreshTokenDto);
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
