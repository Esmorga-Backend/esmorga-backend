import { jest, beforeEach, describe, it, afterAll, expect } from '@jest/globals';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  UserPaginatedItemDto,
  PaginationMetaDto,
  UsersListPaginatedDto,
} from '../../../../src/infrastructure/dtos/users-list-paginated.dto';
import { ACCOUNT_ROLES } from '../../../../src/domain/const';

const VALID_USER_ITEM = {
  id: '64b0f37d9c8d4b3e8a123456',
  name: 'Alice',
  lastName: 'Cooper',
  email: 'alice.cooper@yopmail.com',
  role: ACCOUNT_ROLES.USER,
};

const VALID_PAGINATION_META = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 45,
  totalPages: 5,
};

describe('[unit test] [UsersListPaginatedDto]', () => {
  describe('Happy Path', () => {
    it('Should validate a complete correct object structure', async () => {
      const usersListData = {
        users: [
          VALID_USER_ITEM,
          {
            ...VALID_USER_ITEM,
            id: '64b0f37d9c8d4b3e8a123457',
            name: 'Bob',
            role: ACCOUNT_ROLES.ADMIN,
          },
        ],
        meta: VALID_PAGINATION_META,
      };

      const data = plainToInstance(UsersListPaginatedDto, usersListData);
      const errors = await validate(data);

      expect(errors.length).toBe(0);
      expect(data.users).toHaveLength(2);
      expect(data.meta).toBeDefined();
    });

    it('Should accept an empty users array', async () => {
      const usersListData = {
        users: [],
        meta: VALID_PAGINATION_META,
      };

      const data = plainToInstance(UsersListPaginatedDto, usersListData);
      const errors = await validate(data);

      expect(errors.length).toBe(0);
    });
  });

  describe('Validation Failures', () => {
    describe('[UserPaginatedItemDto]', () => {
      const testCases = [
        {
          field: 'id',
          value: 123,
          description: 'Should reject non-string id',
          constraint: 'isString',
        },
        {
          field: 'name',
          value: 123,
          description: 'Should reject non-string name',
          constraint: 'isString',
        },
        {
          field: 'lastName',
          value: 123,
          description: 'Should reject non-string lastName',
          constraint: 'isString',
        },
        {
          field: 'email',
          value: 123,
          description: 'Should reject non-string email',
          constraint: 'isString',
        },
        {
          field: 'role',
          value: 123,
          description: 'Should reject non-string role',
          constraint: 'isString',
        },
      ];

      it.each(testCases)(
        '$description',
        async ({ field, value, constraint }) => {
          const userData = { ...VALID_USER_ITEM, [field]: value };
          const data = plainToInstance(UserPaginatedItemDto, userData);
          const errors = await validate(data);

          expect(errors.length).toBeGreaterThan(0);
          expect(errors[0].property).toBe(field);
          expect(errors[0].constraints).toHaveProperty(constraint);
        },
      );
    });

    describe('[PaginationMetaDto]', () => {
      const testCases = [
        {
          field: 'currentPage',
          value: '1',
          description: 'Should reject non-number currentPage',
        },
        {
          field: 'itemsPerPage',
          value: '10',
          description: 'Should reject non-number itemsPerPage',
        },
        {
          field: 'totalItems',
          value: '45',
          description: 'Should reject non-number totalItems',
        },
        {
          field: 'totalPages',
          value: '5',
          description: 'Should reject non-number totalPages',
        },
      ];

      it.each(testCases)('$description', async ({ field, value }) => {
        const metaData = { ...VALID_PAGINATION_META, [field]: value };
        const data = plainToInstance(PaginationMetaDto, metaData);
        const errors = await validate(data);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe(field);
        expect(errors[0].constraints).toHaveProperty('isNumber');
      });
    });

    describe('[UsersListPaginatedDto]', () => {
      it('Should validate nested user items', async () => {
        const usersListData = {
          users: [{ ...VALID_USER_ITEM, name: 123 }],
          meta: VALID_PAGINATION_META,
        };
        const data = plainToInstance(UsersListPaginatedDto, usersListData);
        const errors = await validate(data);

        expect(errors.length).toBeGreaterThan(0);
        const userErrors = errors.find((e) => e.property === 'users');
        expect(userErrors).toBeDefined();
      });

      it('Should validate nested meta object', async () => {
        const usersListData = {
          users: [VALID_USER_ITEM],
          meta: { ...VALID_PAGINATION_META, currentPage: 'invalid' },
        };
        const data = plainToInstance(UsersListPaginatedDto, usersListData);
        const errors = await validate(data);

        expect(errors.length).toBeGreaterThan(0);
        const metaErrors = errors.find((e) => e.property === 'meta');
        expect(metaErrors).toBeDefined();
      });

      it('Should reject non-array users', async () => {
        const usersListData = {
          users: 'not-an-array',
          meta: VALID_PAGINATION_META,
        };
        const data = plainToInstance(UsersListPaginatedDto, usersListData);
        const errors = await validate(data);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('users');
        expect(errors[0].constraints).toHaveProperty('isArray');
      });
    });
  });
});
