import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoRepository } from './mongo.repository';
import { User as UserSchema } from '../schema';
import { DataBaseInternalError } from '../errors';

@Injectable()
export class AccountRepository extends MongoRepository<UserSchema> {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserSchema>,
  ) {
    super(userModel);
  }

  async getUserByEmail(email: string): Promise<UserSchema> {
    try {
      const user = await this.findOneByEmail(email);

      return user;
    } catch (error) {
      throw new DataBaseInternalError();
    }
  }
}
