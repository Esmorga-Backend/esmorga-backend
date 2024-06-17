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
  LoginService,
  RegisterService,
} from '../../../application/handler/account';
import { HttpExceptionFilter } from '../errors';
import { AccountLoginDto, AccountRegisterDto } from '../dtos';
import { SwaggerAccountLogin } from '../swagger/decorators/account';
import { AccountLoggedDto } from '../../dtos';

@Controller('/v1/account')
@ApiTags('Account')
@UseFilters(new HttpExceptionFilter())
export class AccountController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
  ) {}

  @Post('/login')
  @SwaggerAccountLogin()
  @HttpCode(200)
  async login(
    @Body() accountLoginDto: AccountLoginDto,
  ): Promise<AccountLoggedDto> {
    try {
      const response: AccountLoggedDto =
        await this.loginService.login(accountLoginDto);

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  @Post('/register')
  async register(
    @Body() accountRegisterDto: AccountRegisterDto,
  ): Promise<AccountLoggedDto> {
    try {
      const response: AccountLoggedDto =
        await this.registerService.register(accountRegisterDto);

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
