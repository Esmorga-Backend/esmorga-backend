import { PollDto } from '../../../src/infrastructure/dtos';

const futureDate: Date = new Date();
futureDate.setFullYear(new Date().getFullYear() + 1);

const oldDate: Date = new Date();
oldDate.setFullYear(new Date().getFullYear() - 1);

const POLL_OPTION_ID_1 = '6656e23640e1fdb4ceb23cd0';
const POLL_OPTION_ID_2 = '6656e23640e1fdb4ceb23cd1';
const OLD_POLL_OPTION_ID_1 = '6656e23640e1fdb4ceb23ce0';
const OLD_POLL_OPTION_ID_2 = '6656e23640e1fdb4ceb23ce1';

export const POLL_MOCK: PollDto = {
  pollId: '6656e23640e1fdb4ceb23cc9',
  pollName: 'MobgenFest',
  description: 'Hello World',
  imageUrl: 'image.url',
  voteDeadline: futureDate,
  options: [
    {
      optionId: POLL_OPTION_ID_1,
      option: 'Option 1',
      voteCount: 3,
    },
    {
      optionId: POLL_OPTION_ID_2,
      option: 'Option 2',
      voteCount: 5,
    },
  ],
  userSelectedOptions: [],
  isMultipleChoice: true,
};

export const OLD_POLL_MOCK: PollDto = {
  pollId: '6656e23640e1fdb4ceb23cc8',
  pollName: 'Old Poll',
  description: 'Hello World',
  imageUrl: 'image.url',
  voteDeadline: oldDate,
  options: [
    {
      optionId: OLD_POLL_OPTION_ID_1,
      option: 'Option 1',
      voteCount: 10,
    },
    {
      optionId: OLD_POLL_OPTION_ID_2,
      option: 'Option 2',
      voteCount: 15,
    },
  ],
  userSelectedOptions: [],
  isMultipleChoice: false,
};
