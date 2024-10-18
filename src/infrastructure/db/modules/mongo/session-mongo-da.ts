import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { Session } from './schema';
import { SessionDA } from '../none/session-da';
import { SessionDto } from '../../../dtos';

@Injectable({})
export class SessionMongoDA implements SessionDA {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) {}
  async create(uuid: string, sessionId: string): Promise<void> {
    await new this.sessionModel({
      uuid,
      sessionId,
    }).save();
  }
  async findByUuid(uuid: string): Promise<SessionDto[]> {
    const sessionDoc = await this.sessionModel.find({ uuid: uuid });
    return sessionDoc.map((data) =>
      plainToClass(SessionDto, data, {
        excludeExtraneousValues: true,
      }),
    );
  }
  async findOneBySessionId(sessionId: string): Promise<SessionDto | null> {
    const sessionData = await this.sessionModel.findOne({
      sessionId: { $eq: sessionId },
    });
    return plainToClass(SessionDto, sessionData, {
      excludeExtraneousValues: true,
    });
  }
  async removeById(id: string): Promise<void> {
    await this.sessionModel.findOneAndDelete({ _id: id });
  }
}
