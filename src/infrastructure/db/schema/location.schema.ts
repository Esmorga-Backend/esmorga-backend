import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Location {
  @Prop({ required: false })
  lat: number;

  @Prop({ required: false })
  long: number;

  @Prop({ required: false })
  name: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
