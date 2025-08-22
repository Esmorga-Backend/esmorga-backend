import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { plainToInstance } from 'class-transformer';
import type { Model } from 'mongoose';
import { UserProfileDto } from '../../../dtos';
import { AccountRegisterDto } from '../../../http/dtos';
import { PasswordSymbol, UserDA } from '../none/user-da';
import { User } from './schema';
import { ACCOUNT_STATUS } from '../../../../domain/const';
@Injectable({})
export class UserMongoDA implements UserDA {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async findOneByEmail(
    email: string,
  ): Promise<UserProfileDto & { [PasswordSymbol]: string }> {
    const user = await this.userModel.findOne({ email: { $eq: email } });

    if (!user) return null;

    const userProfile = plainToInstance(UserProfileDto, user, {
      excludeExtraneousValues: true,
    });
    return { ...userProfile, [PasswordSymbol]: user.password };
  }

  async updatePasswordByEmail(
    email: string,
    password: string,
  ): Promise<UserProfileDto | null> {
    const user = await this.userModel.findOneAndUpdate(
      { email: { $eq: email } },
      {
        password: password,
        status: ACCOUNT_STATUS.ACTIVE,
        expireBlockedAt: null,
      },
      { new: true },
    );
    if (!user) return null;
    return plainToInstance(UserProfileDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async updatePasswordByUuid(
    uuid: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.userModel.findById({ _id: uuid });
    const passwordMatch = await argon2.verify(user.password, currentPassword);

    if (!passwordMatch) return false;

    const newHashedPassword = await argon2.hash(newPassword);
    user.password = newHashedPassword;
    await user.save();
    return true;
  }

  async findOneById(uuid: string): Promise<UserProfileDto | null> {
    const user = await this.userModel.findById({ _id: uuid });

    if (!user) return null;

    return plainToInstance(UserProfileDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findUsersByUuids(uuids: string[]): Promise<UserProfileDto[] | null> {
    const users = await this.userModel.find({
      _id: { $in: uuids },
    });

    if (!users) return null;

    const userProfiles = plainToInstance(UserProfileDto, users, {
      excludeExtraneousValues: true,
    });
    return userProfiles;
  }

  async updateStatusByEmail(
    email: string,
    status: string,
  ): Promise<UserProfileDto | null> {
    const user = await this.userModel.findOneAndUpdate(
      { email },
      { status, expireBlockedAt: null },
      { new: true },
    );
    if (!user) return null;
    return plainToInstance(UserProfileDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async updateBlockedStatusByUuid(
    uuid: string,
    newStatus: string,
    unblockDate: Date,
  ): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { _id: uuid },
      {
        $set: {
          status: newStatus,
          expireBlockedAt: unblockDate,
        },
      },
    );
  }

  async create(userData: AccountRegisterDto): Promise<void> {
    await new this.userModel(userData).save();
  }
}
