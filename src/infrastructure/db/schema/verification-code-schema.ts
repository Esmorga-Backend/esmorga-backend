import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class VerificationCode {
  @Prop({ required: true, index: true, unique: true })
  verificationCode: number;

  @Prop({ required: true, index: true })
  email: string;
}

export const VerificationCodeSchema =
  SchemaFactory.createForClass(VerificationCode);

VerificationCodeSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 });
