import { Injectable, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import axios from 'axios';
import { SubscribersService } from './config/subscribers.service';
import * as schedule from 'node-schedule';
import { Ctx } from 'nestjs-telegraf';




@Injectable()
export class TelegramService {
  private bot: Telegraf;

  constructor(private readonly subscribersService:SubscribersService) {
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    this.initializeBot();
    this.scheduleWeatherUpdates();
  }

  private async initializeBot() {
    this.bot.start((ctx) => {
      ctx.reply(`
        Hello ${ctx.message.from.first_name}, Welcome! I am a weather bot.
        Follow these commands to interact with me:
        /subscribe{city}  - To get daily weather updates, e.g /subscribe Delhi.
        /unsubscribe - To unsubscribe from my service.
        /todayWeather - To know weather of your city.
        /weather{city} - To know wheater of a city,e.g /weather Delhi.
      `);
    });

// subscribe 
this.bot.command('subscribe', async (ctx) => {
  let userId = ctx.message.from.id;
  const name = ctx.message.from.first_name;
  const existingSubscriber = await this.subscribersService.findSubscriberByUserId(userId);
  const commandArgs = ctx.message.text.split(' '); 
  let city:string;

  // Split the command into words
  if (commandArgs.length < 2) {
    ctx.reply('Please provide a city name. Usage: /subscribe {cityName}');
    return ;
  } else {
     city = commandArgs.slice(1).join(' ');
  }
  if (existingSubscriber) {

    ctx.reply('You are already subscribed.');
  } else {

    // Create a new subscriber
    const newSubscriber = await this.subscribersService.createSubscriber(name, userId,city);
    
    if (newSubscriber) {
      ctx.reply('You have been successfully subscribed to weather updates.');
    } else {
      ctx.reply('Unable to subscribe at the moment. Please try again later.');
    }
  }
});



// for unsubscribe
this.bot.command('unsubscribe', async (ctx) => {
  let userId = ctx.message.from.id;
  const name = ctx.message.from.first_name;
  const existingSubscriber = await this.subscribersService.findSubscriberByUserId(userId);
  await this.subscribersService.deleteSubscriber(existingSubscriber.id);
  ctx.reply(`Hey ${name} you have successfully unsubscribed. 
  You won't receive further updates.
  Thank You`)

});



// todayWeather
this.bot.command('weather', async(ctx) => {
  const commandArgs = ctx.message.text.split(' '); 
  // Split the command into words
  if (commandArgs.length < 2) {
    ctx.reply('Please provide a city name. Usage: /weather {city}');
  } else {
    const city = commandArgs.slice(1).join(' ');
     // Join all words except the command itself
    // Now, 'city' contains the city name provided by the user
    const todayTem = await this.fetchWeather(city);
    ctx.reply(`Today's Temperatur of  ${city} is  ${todayTem}`);
  }
});

this.bot.command('todayWeather',async(ctx)=>{
  const existingSubscriber = await this.subscribersService.findSubscriberByUserId(ctx.message.from.id);
  if(!existingSubscriber){
    ctx.reply('You are not subscribed. Please Subscribe or use /weather cityName command');
    return ;
  }
  const todayTem = await this.fetchWeather(existingSubscriber.city);
  ctx.reply(`${todayTem}`);
})

  this.bot.help((ctx) => ctx.reply('Type /start to interact with me'));
  this.bot.command('hello',(ctx)=>{
    ctx.reply('I am Fine How are you ')
  })
  this.bot.on('text', async (ctx) => {
    const userMessage = ctx.message.text;
    const userId = ctx.message.from.id;
    const response =  this.processUserMessage(userMessage, userId);
    ctx.reply(response);

  });

}


  private scheduleWeatherUpdates() {
    const job = schedule.scheduleJob('0 6 * * *', async () => {
      // This code will be executed at 6 AM every day
      console.log('Scheduled task executed at 6 AM.');
      // Fetch weather updates and send them to subscribers
      const subscribers = await this.subscribersService.findAllSubscribers();
      for (const subscriber of subscribers) {
        const weatherDetails = await this.fetchWeather(subscriber.city);
        if (weatherDetails) {
          this.bot.telegram.sendMessage(subscriber.userId,weatherDetails)

        }
        else{
          this.bot.telegram.sendMessage(subscriber.userId,'Report is not available')
        }
      }
    });
  }





  // fetching weather 
  private async fetchWeather(city: string){
    const coordinatesResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=66e757103f41494ca485b0d8529a8196`);
    const coordinates = coordinatesResponse.data.results[0].geometry;
    const weatherResponse = await axios.get(`https://api.tomorrow.io/v4/weather/forecast?location=${coordinates.lat},${coordinates.lng}&apikey=TEtTrRlRpLd15PgAIl9pPYVe4PqKvWXG`);
    const response = weatherResponse.data.timelines.daily[0].values;
    const humidityAvg = response.humidityAvg;
    const temperatureAvg = response.temperatureAvg;
    const temperatureMax = response.temperatureMax;
    const temperatureMin  = response.temperatureMin;
    const windspeedAvg = response.windSpeedAvg;
    let condition:string;
    if(temperatureAvg>23.4){
      condition = 'Hot';
    } else if(temperatureAvg<23.9 && temperatureAvg>18.3){
      condition= "Mild"
    } else{
      condition= "Cold"
    }
  
    const check = `Your city temp will be ${temperatureAvg}:
    Maximum temperature of Day will be ${temperatureMax},
    Minimum temperature of Day will be ${temperatureMin},
    Humidity will be around ${humidityAvg},
    Average wind speed will be ${windspeedAvg} m/s,
    Overall will be a ${condition} day. 
    Thank you.`
    return check;
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
  }
}



    // const coordinatesResponse = await axios.get('https://api.opencagedata.com/geocode/v1/json?q=bulandshahr&key=66e757103f41494ca485b0d8529a8196')
    // const coordinates = coordinatesResponse.data.results[0].geometry;
    // const weatherResponse = await axios.get(`https://api.tomorrow.io/v4/weather/forecast?location=${coordinates.lat},${coordinates.lng}&apikey=TEtTrRlRpLd15PgAIl9pPYVe4PqKvWXG`);
    // const todayTem = weatherResponse.data.timelines.daily[0].values.temperatureAvg;
