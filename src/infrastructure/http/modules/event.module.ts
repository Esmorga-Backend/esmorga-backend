import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from '../controllers/event.controller';
import {
  CreateEventService,
  GetEventListService,
  UpdateEventService,
} from '../../../application/handler/event';
import {
  AccountRepository,
  EventRepository,
  TokensRepository,
} from '../../../infrastructure/db/repositories';
import {
  EventSchema,
  Event,
  UserSchema,
  User,
  TokensSchema,
  Tokens,
} from '../../../infrastructure/db/schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Tokens.name, schema: TokensSchema }]),
  ],
  controllers: [EventController],
  providers: [
    CreateEventService,
    GetEventListService,
    UpdateEventService,
    AccountRepository,
    EventRepository,
    TokensRepository,
  ],
})
export class EventModule {}
