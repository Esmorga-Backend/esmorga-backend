import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { MongoRepository } from './mongo.repository';
import { User as UserSchema } from '../schema';
import {
  DataBaseInternalError,
  DataBaseUnathorizedError,
  DataBaseConflictError,
} from '../errors';
import { UserProfileDto } from '../../dtos';
import { validateObjectDto, REQUIRED_FIELDS } from '../services';

@Injectable()
export class AccountRepository extends MongoRepository<UserSchema> {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserSchema>,
  ) {
    super(userModel);
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.findOneByEmail(email);

      const userProfile: UserProfileDto = plainToClass(UserProfileDto, user, {
        excludeExtraneousValues: true,
      });

      if (!userProfile) throw new DataBaseUnathorizedError();

      validateObjectDto(userProfile, REQUIRED_FIELDS.USER_PROFILE);

      return { userProfile, password: user.password };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }

  async saveUser(data) {
    try {
      const user = new this.userModel(data);

      await this.save(user);
    } catch (error) {
      if (error.code === 11000) throw new DataBaseConflictError();

      throw new DataBaseInternalError();
    }
  }
}
