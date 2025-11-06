import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, type Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { PollDA } from '../none/poll-da';
import { Poll } from './schema';
import { CreatePollDto } from '../../../http/dtos';
import { PollDto } from '../../../dtos';

@Injectable({})
export class PollMongoDA implements PollDA {
  constructor(@InjectModel(Poll.name) private pollModel: Model<Poll>) {}

  async create(createPollDto: CreatePollDto, uuid: string): Promise<void> {
    await new this.pollModel({
      ...createPollDto,
      options: createPollDto.options.map((option) => ({
        option: option,
      })),
      createdBy: uuid,
    }).save();
  }

  async find(): Promise<PollDto[]> {
    const polls = await this.pollModel.find();
    return polls.map((poll) =>
      plainToInstance(PollDto, poll, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findOneById(pollId: string): Promise<PollDto | null> {
    const pollDoc = await this.pollModel.findById({ _id: pollId });
    if (!pollDoc) return null;
    return plainToInstance(PollDto, pollDoc, {
      excludeExtraneousValues: true,
    });
  }

  async vote(
    selectedOptions: string[],
    uuid: string,
    pollId: string,
  ): Promise<PollDto> {
    const selectedIds = selectedOptions.map((id) => new Types.ObjectId(id));

    const updated = await this.pollModel.findOneAndUpdate(
      { _id: pollId },
      {
        $addToSet: { 'options.$[selectedOpt].votes': uuid },
        $pull: { 'options.$[notSelectedOpt].votes': uuid },
      },
      {
        arrayFilters: [
          { 'selectedOpt._id': { $in: selectedIds } },
          { 'notSelectedOpt._id': { $nin: selectedIds } },
        ],
        new: true,
      },
    );

    if (!updated) return null;

    return plainToInstance(PollDto, updated, {
      excludeExtraneousValues: true,
    });
  }
}
