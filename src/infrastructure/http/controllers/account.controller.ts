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
} from '../../../application/handler/account';
import { HttpExceptionFilter } from '../errors';
import { AccountLoginDto, AccountRegisterDto } from '../dtos';
import {
  SwaggerAccountLogin,
  SwaggerAccountRegister,
} from '../swagger/decorators/account';
import { AccountLoggedDto } from '../../dtos';
import { RequestId } from '../req-decorators';

@Controller('/v1/account')
@ApiTags('Account')
@UseFilters(new HttpExceptionFilter())
export class AccountController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
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
}
