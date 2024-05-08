import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

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

  @Prop({ required: false })
  lat: number;

  @Prop({ required: false })
  long: number;

  @Prop({ required: false })
  location: string;

  @Prop({ required: false })
  updatedAt: Date;

  @Prop({ required: false })
  imageUrl: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
