import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreatePollDto } from '../../../../../src/infrastructure/http/dtos';
import { CREATE_POLL_MOCK } from '../../../../mocks/dtos';

describe('[unit-test] [CreatePollDto]', () => {
  it('Should validate all fields successfully', async () => {
    const createPollDto = plainToInstance(CreatePollDto, CREATE_POLL_MOCK);

    const errors = await validate(createPollDto, { stopAtFirstError: true });

    expect(errors.length).toBe(0);
  });
  describe('[CreatePollDto] [pollName]', () => {
    it('Should not accept empty value', async () => {
      const poll = { ...CREATE_POLL_MOCK };

      delete poll.pollName;

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('pollName');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'pollName should not be empty',
      });
    });

    it('Should not accept less than 3 characters', async () => {
      const poll = { ...CREATE_POLL_MOCK };

      poll.pollName = 'AA';

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('pollName');
      expect(errors[0].constraints).toEqual({
        minLength: 'pollName must have min 3 characters',
      });
    });

    it('Should not accept more than 100 characters', async () => {
      const poll = { ...CREATE_POLL_MOCK };

      poll.pollName = 'A'.repeat(300);

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('pollName');
      expect(errors[0].constraints).toEqual({
        maxLength: 'pollName must have max 100 characters',
      });
    });

    it('Should only accept string values', async () => {
      const poll: any = { ...CREATE_POLL_MOCK };

      poll.pollName = 123;

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('pollName');
      expect(errors[0].constraints).toEqual({
        isString: 'pollName must be a string',
      });
    });
  });

  describe('[CreatePollDto] [description]', () => {
    it('Should not accept empty value', async () => {
      const poll = { ...CREATE_POLL_MOCK };

      delete poll.description;

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('description');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'description should not be empty',
      });
    });

    it('Should not accept less than 2 characters', async () => {
      const poll = { ...CREATE_POLL_MOCK };

      poll.description = 'a';

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('description');
      expect(errors[0].constraints).toEqual({
        minLength: 'description must have min 2 characters',
      });
    });

    it('Should not accept more than 1000 characters', async () => {
      const poll = { ...CREATE_POLL_MOCK };

      poll.description = 'A'.repeat(1001);

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('description');
      expect(errors[0].constraints).toEqual({
        maxLength: 'description must have max 1000 characters',
      });
    });

    it('Should only accept string value', async () => {
      const poll: any = { ...CREATE_POLL_MOCK };

      poll.description = 123;

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('description');
      expect(errors[0].constraints).toEqual({
        isString: 'description must be a string',
      });
    });
  });

  describe('[CreatePollDto] [options]', () => {
    it('Should not accept empty value', async () => {
      const poll = { ...CREATE_POLL_MOCK };

      delete poll.options;

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('options');
      expect(errors[0].constraints).toEqual({
        customValidation: 'options should not be empty',
      });
    });
    it('Should not accept less than 2 options', async () => {
      const poll = { ...CREATE_POLL_MOCK };

      poll.options = ['Option 1'];

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('options');
      expect(errors[0].constraints).toEqual({
        arrayMinSize: 'options must contain at least 2 elements',
      });
    });

    it('Should not accept more than 5 options', async () => {
      const poll = { ...CREATE_POLL_MOCK };

      poll.options = [
        'Option 1',
        'Option 2',
        'Option 3',
        'Option 4',
        'Option 5',
        'Option 6',
      ];

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('options');
      expect(errors[0].constraints).toEqual({
        arrayMaxSize: 'options must contain no more than 5 elements',
      });
    });

    it('Should only accept string values', async () => {
      const poll: any = { ...CREATE_POLL_MOCK };

      poll.options = ['Option 1', 2, 'Option 3'];

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('options');
      expect(errors[0].constraints).toEqual({
        isString: 'each value in options must be a string',
      });
    });

    it('Should not accept duplicated options (case-insensitive)', async () => {
      const poll: any = { ...CREATE_POLL_MOCK };

      poll.options = ['Option 1', 'option 1', 'Option 3'];

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('options');
      expect(errors[0].constraints).toEqual({
        arrayUnique: 'options cannot be duplicated',
      });
    });

    it('Should not accept options with less than 1 character', async () => {
      const poll: any = { ...CREATE_POLL_MOCK };

      poll.options = ['Option 1', '', 'Option 3'];

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('options');
      expect(errors[0].constraints).toEqual({
        minLength: 'options must have min 1 character for each option',
      });
    });

    it('Should not accept options with more than 100 characters', async () => {
      const poll: any = { ...CREATE_POLL_MOCK };

      poll.options = ['Option 1', 'A'.repeat(101), 'Option 3'];

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('options');
      expect(errors[0].constraints).toEqual({
        maxLength: 'options must have max 100 characters for each option',
      });
    });
  });

  describe('[CreatePollDto] [voteDeadline]', () => {
    it('Should not accept invalid dates', async () => {
      const poll = { ...CREATE_POLL_MOCK };

      poll.voteDeadline = '2020-03-08T10:65:30.915Z';

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('voteDeadline');
      expect(errors[0].constraints).toEqual({
        customValidation: 'voteDeadline must be valid',
      });
    });

    it('Should not accept past dates', async () => {
      const poll = { ...CREATE_POLL_MOCK };

      poll.voteDeadline = '2020-03-08T10:05:30.915Z';

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('voteDeadline');
      expect(errors[0].constraints).toEqual({
        customValidation: 'voteDeadline cannot be in the past',
      });
    });

    it('Should only accept ISO format', async () => {
      const poll = { ...CREATE_POLL_MOCK };

      poll.voteDeadline = '02-02-1996T03:04:05.000Z';

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('voteDeadline');
      expect(errors[0].constraints).toEqual({
        matches:
          'voteDeadline must be in ISO format (yyyy-MM-ddTHH:mm:ss.SSSZ)',
      });
    });
  });

  describe('[CreatePollDto] [isMultipleChoice]', () => {
    it('Should only accept boolean values', async () => {
      const poll: any = { ...CREATE_POLL_MOCK };

      poll.isMultipleChoice = 'true';

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('isMultipleChoice');
      expect(errors[0].constraints).toEqual({
        isBoolean: 'isMultipleChoice must be a boolean value',
      });
    });

    it('Should not accept empty value', async () => {
      const poll = { ...CREATE_POLL_MOCK };

      delete poll.isMultipleChoice;

      const createPollDto = plainToInstance(CreatePollDto, poll);

      const errors = await validate(createPollDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('isMultipleChoice');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'isMultipleChoice should not be empty',
      });
    });
  });
});
