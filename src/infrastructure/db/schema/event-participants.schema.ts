import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class EventParticipants {
  @Prop({ required: true, unique: true, index: true })
  eventId: string;

  @Prop({ type: [String], required: true })
  participants: string[];
}

export const EventParticipantsSchema =
  SchemaFactory.createForClass(EventParticipants);
