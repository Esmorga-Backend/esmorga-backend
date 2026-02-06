import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/users.controller';
import { AuthGuard } from '../guards';
import { GetUsersService } from '../../../application/handler/users';
import { AccountSharedModule } from './account-shared.module';
import { UsersSharedModule } from './users-shared.module';

@Module({
  imports: [AccountSharedModule, UsersSharedModule],
  controllers: [UsersController],
  providers: [AuthGuard, GetUsersService],
})
export class UsersModule {}
