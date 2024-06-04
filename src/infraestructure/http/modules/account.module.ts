import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountController } from '../controllers';
import { LoginService } from '../../../application/handler/account';
import { AccountRepository } from '../../db/repositories';
import { UserSchema, User } from '../../db/schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AccountController],
  providers: [LoginService, AccountRepository],
})
export class AccountModule {}
