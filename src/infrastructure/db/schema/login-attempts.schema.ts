import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const ttl = Number(process.env.LOGIN_ATTEMPTS_TTL);

@Schema({ timestamps: true })
export class LoginAttempts {
  @Prop({ required: true, index: true })
  uuid: string;

  @Prop({ required: true, default: 0 })
  loginAttempts: number;
}

export const LoginAttemptsSchema = SchemaFactory.createForClass(LoginAttempts);

LoginAttemptsSchema.index({ createdAt: 1 }, { expireAfterSeconds: ttl });
