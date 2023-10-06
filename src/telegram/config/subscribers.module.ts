// subscribers/subscribers.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscribersController } from './Subscriber.controller';
import { SubscribersService } from './subscribers.service';
import { Subscriber, SubscriberSchema } from './subscriber.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Subscriber.name, schema: SubscriberSchema }])],
  controllers: [SubscribersController],
  providers: [SubscribersService],
})
export class SubscribersModule {}
