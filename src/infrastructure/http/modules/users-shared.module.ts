import { Module } from '@nestjs/common';
import { UsersRepository } from '../../../infrastructure/db/repositories';

@Module({
  imports: [],
  controllers: [],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class UsersSharedModule {}
