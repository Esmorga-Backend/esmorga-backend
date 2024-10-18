import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TEMPORAL_CODE_TYPE } from '../../../../../domain/const';

@Schema({ timestamps: true })
export class TemporalCode {
  @Prop({ required: true, index: true, unique: true })
  code: string;

  @Prop({
    required: true,
    enum: [TEMPORAL_CODE_TYPE.FORGOT_PASSWORD, TEMPORAL_CODE_TYPE.VERIFICATION],
  })
  type: string;

  @Prop({ required: true, index: true })
  email: string;
}

export const TemporalCodeSchema = SchemaFactory.createForClass(TemporalCode);

TemporalCodeSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 600 });
