import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { MongoRepository } from './mongo.repository';
import { User as UserSchema } from '../schema';
import { DataBaseInternalError } from '../errors';
import { UserProfileDTO } from '../../dtos';

@Injectable()
export class AccountRepository extends MongoRepository<UserSchema> {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserSchema>,
  ) {
    super(userModel);
  }

  async getUserByEmail(email: string): Promise<UserProfileDTO> {
    try {
      const user = await this.findOneByEmail(email);

      const adaptedUserProfile = plainToClass(UserProfileDTO, user, {
        excludeExtraneousValues: true,
      });

      return adaptedUserProfile;
    } catch (error) {
      throw new DataBaseInternalError();
    }
  }
}
