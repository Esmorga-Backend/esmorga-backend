import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ACCOUNT_ROLES } from '../../../domain/const';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: ACCOUNT_ROLES.USER })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
