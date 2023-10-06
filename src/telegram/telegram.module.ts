import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { SubscribersModule } from './config/subscribers.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscriber, SubscriberSchema } from './config/subscriber.model';
import { SubscribersService } from './config/subscribers.service';

@Module({
  imports:[MongooseModule.forFeature([{ name: Subscriber.name, schema: SubscriberSchema }]),SubscribersModule],
  controllers: [TelegramController],
  providers: [TelegramService,SubscribersService],
})
export class TelegramModule {}

