import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ACCOUNT_ROLES, ACCOUNT_STATUS } from '../../../domain/const';

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

  @Prop({
    required: true,
    enum: [ACCOUNT_ROLES.USER],
    default: ACCOUNT_ROLES.USER,
  })
  role: string;

  @Prop({
    required: true,
    eanum: [
      ACCOUNT_STATUS.ACTIVE,
      ACCOUNT_STATUS.UNVERIFIED,
      ACCOUNT_STATUS.BLOCKED,
    ],
    default: ACCOUNT_STATUS.UNVERIFIED,
  })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
