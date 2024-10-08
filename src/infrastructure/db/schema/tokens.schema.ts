import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Tokens {
  @Prop({ required: true, index: true })
  uuid: string;

  @Prop({ required: true, unique: true, index: true })
  accessToken: string;

  @Prop({ required: true, unique: true, index: true })
  refreshToken: string;
}

export const TokensSchema = SchemaFactory.createForClass(Tokens);
