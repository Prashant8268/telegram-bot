// subscribers/subscribers.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { Subscriber } from './subscriber.model';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  async createSubscriber(@Body() subscriberData: Subscriber): Promise<Subscriber> {
    return this.subscribersService.createSubscriber(subscriberData.name, subscriberData.userId,subscriberData.city);
  }

  @Get()
  async findAllSubscribers(): Promise<Subscriber[]> {
    return this.subscribersService.findAllSubscribers();
  }

  @Get(':id')
  async findSubscriberById(@Param('id') id: string): Promise<Subscriber | null> {
    return this.subscribersService.findSubscriberById(id);
  }

  @Put(':id')
  async updateSubscriber(
    @Param('id') id: string,
    @Body() subscriberData: Subscriber,
  ): Promise<Subscriber | null> {
    return this.subscribersService.updateSubscriber(id, subscriberData.name, subscriberData.userId);
  }

  @Delete(':id')
  async deleteSubscriber(@Param('id') id: string): Promise<Subscriber | null> {
    return this.subscribersService.deleteSubscriber(id);
  }
}
