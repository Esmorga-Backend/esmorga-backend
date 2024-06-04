import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { AccountRepository } from '../../../infraestructure/db/repositories';
import { AccountLoginDTO, UserProfileDTO } from '../../../infraestructure/dtos';
import { validateLoginCredentials } from '../../../domain/services';

@Injectable()
export class LoginService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private jwtService: JwtService,
  ) {}

  async login(accountLoginDTO: AccountLoginDTO) {
    try {
      const { email, password } = accountLoginDTO;

      const user = await this.accountRepository.getUserByEmail(email);

      validateLoginCredentials(user, password);

      const adaptedUserProfile = plainToClass(UserProfileDTO, user, {
        excludeExtraneousValues: true,
      });

      const { uuid } = adaptedUserProfile;

      const accessToken = this.jwtService.sign({ uuid });

      console.log({ accessToken });

      return adaptedUserProfile;
    } catch (error) {
      throw error;
    }
  }
}
