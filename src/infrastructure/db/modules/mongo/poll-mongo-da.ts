import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Model } from 'mongoose';
import { PollDA } from '../none/poll-da';
import { Poll } from './schema';
import { CreatePollDto } from '../../../http/dtos';

@Injectable()
export class PollMongoDA implements PollDA {
  constructor(
    @InjectModel(Poll.name) private readonly pollModel: Model<Poll>,
  ) {}

  async create(createPollDto: CreatePollDto, uuid: string): Promise<void> {
    await new this.pollModel({
      ...createPollDto,
      options: createPollDto.options.map((option) => ({
        option: option,
      })),
      createdBy: uuid,
    }).save();
  }
}
