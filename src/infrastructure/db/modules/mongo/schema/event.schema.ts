import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Location, LocationSchema } from './location.schema';
import { EventParticipants } from './event-participants.schema';

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  eventName: string;

  @Prop({ required: true })
  eventDate: Date;

  @Prop({ required: true })
  eventType: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: false, default: undefined })
  tags: string[];

  @Prop({ type: LocationSchema, required: true })
  location: Location;

  @Prop({ required: false })
  imageUrl: string;

  @Prop({ required: false })
  joinDeadline: Date;

  @Prop({ required: false })
  maxCapacity: number;

  @Virtual({ 
    options: {
        ref: EventParticipants.name,
        localField: '_id',
        foreignField: 'eventId',
        justOne: true
    }
   })
  currentAttendeeCount: EventParticipants;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: false, default: undefined })
  updatedBy: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
