import { TEMPORAL_CODE_TYPE } from '../../../src/domain/const';
import { EMAIL_MOCK_DB } from './user';
import { TEMPORAL_CODE_DB_ID } from './common';

export const VERIFICATION_CODE_DATA_MOCK_DB = {
  _id: TEMPORAL_CODE_DB_ID,
  code: 123456,
  type: TEMPORAL_CODE_TYPE.VERIFICATION,
  email: EMAIL_MOCK_DB,
  createdAt: new Date(),
  updatedAt: new Date(),
};
