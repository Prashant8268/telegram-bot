

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema() 
export class Subscriber extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  userId: number;

  @Prop({required:true})
  city:string;
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
