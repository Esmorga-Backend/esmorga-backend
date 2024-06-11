import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { MongoRepository } from './mongo.repository';
import { User as UserSchema } from '../schema';
import { DataBaseInternalError, DataBaseUnathorizedError } from '../errors';
import { UserProfileDTO } from '../../dtos';

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

      const userProfile = plainToClass(UserProfileDTO, user, {
        excludeExtraneousValues: true,
      });

      if (!userProfile) throw new DataBaseUnathorizedError();

      return { userProfile, password: user.password };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }
}
