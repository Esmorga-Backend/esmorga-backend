import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginAttempts } from './schema';
import { LoginAttemptsDA } from '../none/login-attempts-da';

@Injectable({})
export class LoginAttemptsMongoDA implements LoginAttemptsDA {
  constructor(
    @InjectModel(LoginAttempts.name)
    private loginAttemptsModel: Model<LoginAttempts>,
  ) {}
  async findAndUpdateLoginAttempts(uuid: string): Promise<number> {
    const { loginAttempts } = await this.loginAttemptsModel.findOneAndUpdate(
      { uuid },
      { $inc: { loginAttempts: 1 } },
      { upsert: true, new: true },
    );
    return loginAttempts;
  }
  async removeByUuid(uuid: string): Promise<void> {
    await this.loginAttemptsModel.findOneAndDelete({ uuid });
  }
}
