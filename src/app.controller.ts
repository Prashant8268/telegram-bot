import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('op')
  letTalk():string {
    return "This is working "
  }
}

@Controller('hey')

export class HeyController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'hey homepage';
  }

  @Get('op')
  letTalk():string {
    return "hey op "
  }
}

