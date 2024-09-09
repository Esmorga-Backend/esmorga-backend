import { TEMPORAL_CODE_TYPE } from '../../../src/domain/const';
import { EMAIL_MOCK_DB } from './user';

export const VERIFICATION_CODE_DATA_MOCK_DB = {
  code: 123456,
  type: TEMPORAL_CODE_TYPE.VERIFICATION,
  email: EMAIL_MOCK_DB,
};
