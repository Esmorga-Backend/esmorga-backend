import { PollDto } from '../../../src/infrastructure/dtos';

const futureDate: Date = new Date();
futureDate.setFullYear(new Date().getFullYear() + 1);

const votedeadline: Date = new Date(futureDate);
votedeadline.setDate(votedeadline.getDate() - 1);

export const POLL_MOCK: PollDto = {
  pollId: '6656e23640e1fdb4ceb23cc9',
  pollName: 'MobgenFest',
  description: 'Hello World',
  voteDeadline: votedeadline,
  options: [
    {
      optionId: 'option1',
      option: 'Option 1',
      voteCount: 3,
    },
    {
      optionId: 'option2',
      option: 'Option 2',
      voteCount: 5,
    },
  ],
  userSelectedOptions: [],
  isMultipleChoice: true,
};
