import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { GetUsersDto } from '../../../../../src/infrastructure/http/dtos/get-users.dto';

describe('[unit test] [GetUsersDto]', () => {
  describe('Happy Path', () => {
    it('Should validate a default instance with correct default values', async () => {
      const data = plainToInstance(GetUsersDto, {});
      const errors = await validate(data);

      expect(errors.length).toBe(0);
      expect(data.page).toBe(1);
      expect(data.limit).toBe(10);
      expect(data.sortBy).toBe('name');
      expect(data.order).toBe('asc');
    });

    it('Should validate correct custom values', async () => {
      const payload = {
        page: 2,
        limit: 20,
        sortBy: 'email',
        order: 'desc',
      };
      const data = plainToInstance(GetUsersDto, payload);
      const errors = await validate(data);

      expect(errors.length).toBe(0);
      expect(data.page).toBe(2);
      expect(data.limit).toBe(20);
      expect(data.sortBy).toBe('email');
      expect(data.order).toBe('desc');
    });

    it('Should transform string numbers to integers', async () => {
      const payload = {
        page: '5',
        limit: '50',
      };
      const data = plainToInstance(GetUsersDto, payload);
      const errors = await validate(data);

      expect(errors.length).toBe(0);
      expect(data.page).toBe(5);
      expect(data.limit).toBe(50);
    });
  });

  describe('Validation Failures', () => {
    const testCases = [
      {
        field: 'page',
        value: 0,
        constraint: 'min',
        description: 'Should reject page < 1',
      },
      {
        field: 'page',
        value: 1.5,
        constraint: 'isInt',
        description: 'Should reject non-integer page',
      },
      {
        field: 'limit',
        value: 0,
        constraint: 'min',
        description: 'Should reject limit < 1',
      },
      {
        field: 'limit',
        value: 10.5,
        constraint: 'isInt',
        description: 'Should reject non-integer limit',
      },
      {
        field: 'sortBy',
        value: 'invalid_field',
        constraint: 'isEnum',
        description: 'Should reject invalid sortBy field',
      },
      {
        field: 'order',
        value: 'invalid_order',
        constraint: 'isEnum',
        description: 'Should reject invalid order',
      },
    ];

    it.each(testCases)('$description', async ({ field, value, constraint }) => {
      const payload = { [field]: value };
      const data = plainToInstance(GetUsersDto, payload);
      const errors = await validate(data);

      expect(errors.length).toBeGreaterThan(0);
      const error = errors.find((e) => e.property === field);
      expect(error).toBeDefined();
      expect(error.constraints).toHaveProperty(constraint);
    });
  });
});
