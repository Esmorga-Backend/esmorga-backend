import { UpdatePasswordDto } from '../../../src/infrastructure/http/dtos';

export const UPDATE_PASSWORD: UpdatePasswordDto = {
  password: 'SuperSecret1!',
  forgotPasswordCode: '123456',
};
