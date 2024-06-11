import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Location, LocationSchema } from './location.schema';

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

  @Prop({ type: [String], required: false })
  tags: string[];

  @Prop({ type: LocationSchema, required: true })
  location: Location;

  @Prop({ required: false })
  imageUrl: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
