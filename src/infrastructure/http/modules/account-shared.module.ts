import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import {
  AccountRepository,
  TokensRepository,
} from '../../../infrastructure/db/repositories';
import {
  UserSchema,
  User,
  TokensSchema,
  Tokens,
} from '../../../infrastructure/db/schema';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Tokens.name, schema: TokensSchema }]),
  ],
  controllers: [],
  providers: [AccountRepository, TokensRepository],
  exports: [AccountRepository, TokensRepository, JwtModule, MongooseModule],
})
export class AccountSharedModule {}
