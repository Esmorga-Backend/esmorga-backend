import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
const ttl = Number(process.env.LOGIN_ATTEMPTS_TTL);

@Schema({ timestamps: true })
export class LoginAttemps {
  @Prop({ required: true, index: true })
  uuid: string;

  @Prop({ required: true, default: 0 })
  loginAttempts: number;
}

export const LoginAttempsSchema = SchemaFactory.createForClass(LoginAttemps);

LoginAttempsSchema.index({ createdAt: 1 }, { expireAfterSeconds: ttl });
