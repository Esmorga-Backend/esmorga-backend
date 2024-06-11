import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

//TODO implement index for each token
@Schema({ timestamps: true })
export class Tokens {
  @Prop({ required: true })
  uuid: string;

  @Prop({ required: true, unique: true })
  accessToken: string;

  @Prop({ required: true, unique: true })
  refreshToken: string;
}

export const TokensSchema = SchemaFactory.createForClass(Tokens);
