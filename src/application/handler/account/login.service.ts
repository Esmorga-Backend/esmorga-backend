import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../../infraestructure/db/repositories';
import { AccountLoginDTO } from '../../../infraestructure/dtos';

@Injectable()
export class LoginService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async login(accountLoginDTO: AccountLoginDTO) {
    try {
      const { email, password } = accountLoginDTO;

      const user = await this.accountRepository.getUserByEmail(email);

      return user;
    } catch (error) {
      throw error;
    }
  }
}
