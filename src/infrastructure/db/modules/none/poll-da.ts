import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreatePollDto } from '../../../http/dtos';

@Injectable()
export class PollDA {
  create(_poll: CreatePollDto, _userId: string): Promise<void> {
    throw new NotImplementedException();
  }
}
