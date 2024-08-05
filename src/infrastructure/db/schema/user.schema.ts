import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { USER_ROLE } from '../../../domain/user-const';

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

  @Prop({ required: true, default: USER_ROLE.USER })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
