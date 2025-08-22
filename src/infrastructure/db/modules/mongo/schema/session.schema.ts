import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Session {
  @Prop({ required: true, index: true })
  uuid: string;

  @Prop({ required: true, unique: true, index: true })
  sessionId: string;

  @Prop({ required: true, unique: true, index: true })
  refreshTokenId: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
