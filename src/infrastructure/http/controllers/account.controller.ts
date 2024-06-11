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
import { LoginService } from '../../../application/handler/account';
import { HttpExceptionFilter } from '../errors';
import { AccountLoginDto } from '../../dtos';
import { SwaggerAccountLogin } from '../swagger/decorators/account';

@Controller('/v1/account')
@ApiTags('Account')
export class AccountController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/login')
  @SwaggerAccountLogin()
  @UseFilters(new HttpExceptionFilter())
  @HttpCode(200)
  async login(@Body() accountLoginDto: AccountLoginDto) {
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
}
