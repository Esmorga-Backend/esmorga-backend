import { UpdatePasswordDto } from '../../../src/infrastructure/http/dtos';

export const UPDATE_PASSWORD: UpdatePasswordDto = {
  currentPassword: 'SuperSecret1!',
  newPassword: 'SuperSecret2!',
};
