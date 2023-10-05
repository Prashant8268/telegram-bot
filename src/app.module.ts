import { Module } from '@nestjs/common';
import { AppController,HeyController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { TelegramController } from './telegram/telegram.controller';
import {TelegramService} from './telegram/telegram.service'

@Module({
  imports: [TelegramModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
