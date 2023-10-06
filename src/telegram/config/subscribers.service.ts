// subscribers/subscribers.service.ts

import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber } from './subscriber.model';

@Injectable()
export class SubscribersService {
  constructor(@InjectModel(Subscriber.name) private readonly subscriberModel: Model<Subscriber>) {}

  async createSubscriber(name: string, userId: number,city: string): Promise<Subscriber> {
    const subscriber = new this.subscriberModel({ name, userId,city });
    return subscriber.save();
  }

  async findAllSubscribers(): Promise<Subscriber[]> {
    return this.subscriberModel.find().exec();
  }

  async findSubscriberById(id: string): Promise<Subscriber | null> {
    return this.subscriberModel.findById(id).exec();
  }

  async findSubscriberByUserId(userId: number): Promise<Subscriber | null>{
    return this.subscriberModel.findOne({userId})
  }

  async updateSubscriber(id: string, name: string, userId: number): Promise<Subscriber | null> {
    return this.subscriberModel.findByIdAndUpdate(id, { name, userId }, { new: true }).exec();
  }

  async deleteSubscriber(id: string): Promise<Subscriber | null> {
    return this.subscriberModel.findByIdAndRemove(id).exec();
  }
}
