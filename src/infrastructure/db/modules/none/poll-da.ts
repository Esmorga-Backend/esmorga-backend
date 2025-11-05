import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreatePollDto } from '../../../http/dtos';
import { PollDto } from '../../../dtos';

@Injectable()
export class PollDA {
  create(_poll: CreatePollDto, _userId: string): Promise<void> {
    throw new NotImplementedException();
  }
  find(): Promise<PollDto[]> {
    throw new NotImplementedException();
  }

  vote(_votePollDto: any, _userId: string, _pollId: string): Promise<PollDto> {
    throw new NotImplementedException();
  }
}
