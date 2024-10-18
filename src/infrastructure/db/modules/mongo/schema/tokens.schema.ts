import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * @deprecated This class is the old token storage.
 */
@Schema({ timestamps: true })
export class Tokens {
  @Prop({ required: true, index: true })
  uuid: string;

  @Prop({ required: true, unique: true, index: true })
  accessToken: string;

  @Prop({ required: true, unique: true, index: true })
  refreshToken: string;
}

/**
 * @deprecated This schema was the previous token storage.
 */
export const TokensSchema = SchemaFactory.createForClass(Tokens);
