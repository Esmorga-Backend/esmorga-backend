import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Location, LocationSchema } from './location.schema';

@Schema()
export class Event {
  @Prop({ required: true })
  eventName: string;

  @Prop({ required: true })
  eventDate: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  tags: string[];

  @Prop({ type: LocationSchema, required: false })
  location: Location;

  @Prop({ required: false })
  updatedAt: Date;

  @Prop({ required: false })
  imageUrl: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
