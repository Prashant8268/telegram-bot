import { Module } from '@nestjs/common';
import { AppController} from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscribersModule } from './telegram/config/subscribers.module';
import 'dotenv/config'; 
@Module({
imports: [MongooseModule.forRoot(process.env.MONGO_URL),TelegramModule,SubscribersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}