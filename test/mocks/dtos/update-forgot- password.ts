import { UpdateForgotPasswordDto } from '../../../src/infrastructure/http/dtos';

export const UPDATE_PASSWORD: UpdateForgotPasswordDto = {
  password: 'SuperSecret1!',
  forgotPasswordCode: '123456',
};
