import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PollOption {
  @Prop({ required: true })
  option: string;
  @Prop({ required: false, default: undefined })
  votes: string[];
}

export const PollOptionSchema = SchemaFactory.createForClass(PollOption);

@Schema({ timestamps: true })
export class Poll {
  @Prop({ required: true })
  pollName: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [PollOptionSchema], required: true })
  options: PollOption[];

  @Prop({ required: true })
  voteDeadline: Date;

  @Prop({ required: true })
  isMultipleChoice: boolean;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: false, default: undefined })
  updatedBy: string;
}

export const PollSchema = SchemaFactory.createForClass(Poll);
