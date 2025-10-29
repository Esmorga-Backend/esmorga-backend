import { CreatePollDto } from '../../../src/infrastructure/http/dtos';

const voteDeadline: Date = new Date();
voteDeadline.setFullYear(new Date().getFullYear() + 1);

export const CREATE_POLL_MOCK: CreatePollDto = {
  pollName: 'MobgenFest',
  description: 'Hello World',
  options: ['Option 1', 'Option 2', 'Option 3'],
  voteDeadline: voteDeadline.toISOString(),
  isMultipleChoice: true,
};
