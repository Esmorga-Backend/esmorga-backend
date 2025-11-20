import { Injectable, NotImplementedException } from '@nestjs/common';
import { UserProfileDto } from '../../../dtos';
import { AccountRegisterDto } from '../../../http/dtos';

export const PasswordSymbol = Symbol('_password');

@Injectable()
export class UserDA {
  findOneById(_uuid: string): Promise<UserProfileDto | null> {
    throw new NotImplementedException();
  }

  findOneByEmail(
    _email: string,
  ): Promise<UserProfileDto & { [PasswordSymbol]: string }> {
    throw new NotImplementedException();
  }

  findUsersByUuids(_uuids: string[]): Promise<UserProfileDto[] | null> {
    throw new NotImplementedException();
  }

  updateStatusByEmail(
    _email: string,
    _status: string,
  ): Promise<UserProfileDto | null> {
    throw new NotImplementedException();
  }

  updatePasswordByEmail(
    _email: string,
    _password: string,
  ): Promise<UserProfileDto | null> {
    throw new NotImplementedException();
  }

  updatePasswordByUuid(
    _uuid: string,
    _currentPassword: string,
    _newPassword: string,
  ): Promise<boolean> {
    throw new NotImplementedException();
  }

  updateBlockedStatusByUuid(
    _uuid: string,
    _newStatus: string,
    _unblockDate: Date,
  ) {
    throw new NotImplementedException();
  }

  create(_userData: AccountRegisterDto) {
    throw new NotImplementedException();
  }

  deleteByUuid(_uuid: string): Promise<void> {
    throw new NotImplementedException();
  }
}
