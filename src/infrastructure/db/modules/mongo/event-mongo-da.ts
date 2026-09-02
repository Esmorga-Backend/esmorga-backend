import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, type Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { EventDA } from '../none/event-da';
import { Event } from './schema';
import { EventDto } from '../../../dtos';
import { CreateEventDto } from '../../../http/dtos';

@Injectable({})
export class EventMongoDA implements EventDA {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}
  async find(): Promise<EventDto[]> {
    const events = await this.eventModel.find().populate('currentAttendeeCount');
    return events.map((event) =>
      plainToInstance(EventDto, event, {
        excludeExtraneousValues: true,
      }),
    );
  }
  async create(createEventDto: CreateEventDto, email: string): Promise<void> {
    await new this.eventModel({
      ...createEventDto,
      createdBy: email,
    }).save();
  }
  async findOneById(eventId: string): Promise<EventDto | null> {
    const eventDoc = await this.eventModel.findById({ _id: eventId }).populate('currentAttendeeCount');
    if (!eventDoc) return null;
    return plainToInstance(EventDto, eventDoc, {
      excludeExtraneousValues: true,
    });
  }
  async findByEventIds(eventIds: string[]): Promise<EventDto[]> {
    if (!eventIds?.length) return [];
    const objectIds = eventIds.map((id) => {
      return new Types.ObjectId(id);
    });
    const events = await this.eventModel.find({ _id: { $in: objectIds } }).populate('currentAttendeeCount');;
    return events.map((event) =>
      plainToInstance(EventDto, event, {
        excludeExtraneousValues: true,
      }),
    );
  }
  async findByEmail(email: string): Promise<EventDto[]> {
    const events = await this.eventModel.find({ createdBy: email }).populate('currentAttendeeCount');;

    return events.map((event) =>
      plainToInstance(EventDto, event, {
        excludeExtraneousValues: true,
      }),
    );
  }
  async updateById(
    eventId: string,
    eventUpdate: Partial<EventDto>,
  ): Promise<EventDto | null> {
    const update: any = { $set: eventUpdate };

    if (eventUpdate && eventUpdate.joinDeadline === null) {
      update.$unset = { joinDeadline: 1 };
      delete update.$set.joinDeadline;
    }

    const updatedEvent = await this.eventModel.findOneAndUpdate(
      { _id: eventId },
      update,
      { new: true },
    ).populate('currentAttendeeCount');

    return plainToInstance(EventDto, updatedEvent, {
      excludeExtraneousValues: true,
    });
  }
  async removeById(eventId: string): Promise<void> {
    await this.eventModel.findOneAndDelete({ _id: eventId });
  }
}
