import { Injectable, Logger } from '@nestjs/common';
// import fetch from 'node-fetch';
import { ConfigService } from '@nestjs/config';
import { TelegramBot } from 'node-telegram-bot-api';
import { Telegraf } from 'telegraf';


@Injectable()
// export class TelegramService {
//   private readonly baseUrl: string;
//   private readonly token: string;

//   constructor() {
//     this.baseUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}}`;
//     this.token = process.env.TELEGRAM_BOT_TOKEN;
//   }

//   async sendMessage(chatId: number, text: string): Promise<void> {
//     const url = `${this.baseUrl}/sendMessage`;
//     const params = { chat_id: chatId, text };
  
//     try {
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(params),
//       });
  
//       if (!response.ok) {
//         // Handle non-OK responses (e.g., HTTP 4xx or 5xx errors)
//         throw new Error(`Failed to send message: ${response.statusText}`);
//       }
//     } catch (error) {
//       // Handle network errors or other exceptions
//       throw new Error(`Error sending message: ${error.message}`);
//     }
//   }
  
// }

export class TelegramService {
  private bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    this.initializeBot();
  }

  private initializeBot() {
    // this.bot.command(['ping', 'start'], (ctx) => {
    //   ctx.reply('Bot is active and running!');
    // });
    this.bot.start((ctx) => ctx.reply('Welcome to Weather Bot!'));
    this.bot.help((ctx) => ctx.reply('Type /weather {city} to get weather information.'));
    this.bot.command('hello',(ctx)=>{
      ctx.reply('I am Fine How are you ')
    })
    this.bot.on('text', async (ctx) => {
      const userMessage = ctx.message.text;
      const userId = ctx.message.from.id;
      
      // Process and respond to the user's message as needed
      const response = await this.processUserMessage(userMessage, userId);
      
      
      // Send a response back to the user
      ctx.reply(response);
    });
    // this.bot.command('weather', async (ctx) => {
    //   const commandArgs = ctx.message.text.split(' ');
    //   if (commandArgs.length < 2) {
    //     ctx.reply('Please provide a city name. Usage: /weather {city}');
    //   } else {
    //     const city = commandArgs.slice(1).join(' ');
    //     // try {
    //     //   // const weatherInfo = await this.weatherService.getWeather(city);
    //     //   // ctx.reply(weatherInfo);
    //     // } catch (error) {
    //     //   ctx.reply('Unable to fetch weather data. Please try again later.');
    //     // }
    //   }
    // });
  }
  private processUserMessage(userMessage: string, userId:number): string {
    if (userMessage.toLowerCase().includes('hello')) {
      return 'Hi there!';
    }

    if (userMessage.toLowerCase().includes('how are you')) {
      return "I'm just a bot, but I'm here to help!";
    }

    return 'I did not understand your message. Please try again or use commands.';
  }

  startBot() {
    this.bot.launch();
    console.log('runnign')
  }
}