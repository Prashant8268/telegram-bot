import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramService } from './telegram/telegram.service';
import 'dotenv/config'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const telegramService = app.get(TelegramService);
  telegramService.startBot();
  await app.listen(3000);

}
export const handler = async (event, context) => {
  await bootstrap();
};
