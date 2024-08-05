import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { EventController } from '../controllers/event.controller';
import { AuthGuard } from '../guards';
import {
  CreateEventService,
  GetEventListService,
  UpdateEventService,
} from '../../../application/handler/event';
import { EventSharedModule } from './event-shared.module';
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
    EventSharedModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Tokens.name, schema: TokensSchema }]),
  ],
  controllers: [EventController],
  providers: [
    AuthGuard,
    CreateEventService,
    GetEventListService,
    UpdateEventService,
    AccountRepository,
    TokensRepository,
  ],
})
export class EventModule {}
