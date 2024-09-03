import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { MongoRepository } from './mongo.repository';
import { VerificationCode as VerificationCodeSchema } from '../schema';

@Injectable()
export class VerificationCodeRepository extends MongoRepository<VerificationCodeSchema> {
  constructor(
    @InjectModel(VerificationCodeSchema.name)
    private verificationCodeModel: Model<VerificationCodeSchema>,
    private readonly logger: PinoLogger,
  ) {
    super(verificationCodeModel);
  }

  /**
   * Store the email and the verification code with a deadline.
   *
   * @param email - Email user identifier.
   * @param requestId - Request identifier for API logger
   */
  sendVerificationCode(
    email: string,
    verificationCode: string,
    requestId: string,
  ) {
    console.log(
      `>*> EMAIL: ${email}, CÓDIGO: ${verificationCode}, REQUEST_ID: ${requestId}`,
    );
  }
}
