import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AccountController } from '../controllers';
import { LoginService } from '../../../application/handler/account';
import { AccountRepository } from '../../db/repositories';
import { UserSchema, User } from '../../db/schema';
import { GenerateTokenPair } from '../../../domain/services';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AccountController],
  providers: [LoginService, AccountRepository, GenerateTokenPair],
})
export class AccountModule {}
