import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
@Injectable()
export class GetUsersService {
  constructor(private readonly logger: PinoLogger) {

  async getUsers(): Promise<void> {

      
    }

  }
}
