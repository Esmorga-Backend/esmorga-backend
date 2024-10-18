import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class LoginAttemptsDA {
  findAndUpdateLoginAttempts(_uuid: string): Promise<number> {
    throw new NotImplementedException();
  }
  removeByUuid(_uuid: string): Promise<void> {
    throw new NotImplementedException();
  }
}
