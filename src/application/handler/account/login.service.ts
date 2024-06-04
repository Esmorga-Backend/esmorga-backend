import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AccountRepository } from '../../../infraestructure/db/repositories';
import { AccountLoginDTO, UserProfileDTO } from '../../../infraestructure/dtos';
import { validateLoginCredentials } from '../../../domain/services';

@Injectable()
export class LoginService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async login(accountLoginDTO: AccountLoginDTO) {
    try {
      const { email, password } = accountLoginDTO;

      const user = await this.accountRepository.getUserByEmail(email);

      validateLoginCredentials(user, password);

      const adaptedUserProfile = plainToClass(UserProfileDTO, user, {
        excludeExtraneousValues: true,
      });

      return adaptedUserProfile;
    } catch (error) {
      throw error;
    }
  }
}
