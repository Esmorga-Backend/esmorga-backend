import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { TemporalCode } from './schema';
import { TemporalCodeDA } from '../none/temporal-code-da';
import { TemporalCodeDto } from '../../../dtos';

@Injectable({})
export class TemporalCodeMongoDA implements TemporalCodeDA {
  constructor(
    @InjectModel(TemporalCode.name)
    private temporalCodeModel: Model<TemporalCode>,
  ) {}
  async findAndUpdateTemporalCode(
    code: string,
    type: string,
    email: string,
  ): Promise<void> {
    await this.temporalCodeModel.findOneAndUpdate(
      { email, type },
      { $set: { code: code } },
      { upsert: true },
    );
  }
  async findOneByCodeAndType(
    code: string,
    codeType: string,
  ): Promise<TemporalCodeDto> {
    const tempCodeDoc = await this.temporalCodeModel.findOne({
      code: { $eq: code },
      type: { $eq: codeType },
    });
    return plainToInstance(TemporalCodeDto, tempCodeDoc, {
      excludeExtraneousValues: true,
    });
  }
  async removeById(id: string): Promise<void> {
    await this.temporalCodeModel.findOneAndDelete({ _id: id });
  }
}
