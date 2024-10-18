import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { EventParticipantsDA } from '../none/event-participant-da';
import { EventParticipants } from './schema';
import { EventParticipantsDto } from '../../../dtos';

@Injectable({})
export class EventParticipantsMongoDA implements EventParticipantsDA {
  constructor(
    @InjectModel(EventParticipants.name)
    private eventParticipantsModel: Model<EventParticipants>,
  ) {}
  async findEventParticipant(userId: string): Promise<string[]> {
    const eventParticipantsDocs = await this.eventParticipantsModel.find({
      participants: { $in: [userId] },
    });
    return eventParticipantsDocs.map((singleEventParticipanstDb) => {
      const eventParticipants: EventParticipantsDto = plainToClass(
        EventParticipantsDto,
        singleEventParticipanstDb,
        {
          excludeExtraneousValues: true,
        },
      );
      return eventParticipants.eventId;
    });
  }
  async removeByEventId(eventId: string): Promise<void> {
    await this.eventParticipantsModel.findOneAndDelete({
      eventId: { $eq: eventId },
    });
  }
  async findAndUpdateParticipantsList(
    eventId: string,
    userId: string,
  ): Promise<void> {
    await this.eventParticipantsModel.findOneAndUpdate(
      { eventId },
      { $addToSet: { participants: userId } },
      { upsert: true },
    );
  }
  async removeParticipantFromList(
    eventId: string,
    userId: string,
  ): Promise<void> {
    await this.eventParticipantsModel.updateOne(
      { eventId },
      { $pull: { participants: userId } },
    );
  }
}
