import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { VotePollDto } from '../../../../../src/infrastructure/http/dtos';
import { VOTE_POLL_MOCK } from '../../../../mocks/dtos/vote-poll';

describe('[unit-test] [VotePollDto]', () => {
  it('Should validate all fields successfully', async () => {
    const votePollDto = plainToInstance(VotePollDto, VOTE_POLL_MOCK);

    const errors = await validate(votePollDto, { stopAtFirstError: true });

    expect(errors.length).toBe(0);
  });

  describe('[VotePollDto] [selectedOptions]', () => {
    it('Should not accept an empty array in selectedOptions', async () => {
      const votePollData = { ...VOTE_POLL_MOCK, selectedOptions: [] };

      const votePollDto = plainToInstance(VotePollDto, votePollData);

      const errors = await validate(votePollDto, {
        stopAtFirstError: true,
      });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('selectedOptions');
      expect(errors[0].constraints).toEqual({
        customValidation: 'selectedOptions should not be empty',
      });
    });

    it('Should not accept non string values in selectedOptions', async () => {
      const votePollData = {
        ...VOTE_POLL_MOCK,
        selectedOptions: ['6656e23640e1fdb4ceb23cc9', 123],
      };

      const votePollDto = plainToInstance(VotePollDto, votePollData);

      const errors = await validate(votePollDto, {
        stopAtFirstError: false,
      });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('selectedOptions');
      expect(errors[0].constraints).toBeDefined();
      expect(
        errors[0].constraints?.isString ?? errors[0].constraints?.eachIsString,
      ).toEqual('each value in selectedOptions must be a string');
    });
  });
});
