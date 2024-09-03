import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class VerificationCode {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  code: string;
}

export const VerificationCodeSchema =
  SchemaFactory.createForClass(VerificationCode);

VerificationCodeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });
