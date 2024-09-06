import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class TemporalCode {
  @Prop({ required: true, index: true, unique: true })
  email: string;

  @Prop({ required: true, index: true })
  code: string;
}

export const TemporalCodeSchema = SchemaFactory.createForClass(TemporalCode);

TemporalCodeSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 600 });
