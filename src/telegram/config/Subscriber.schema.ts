import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type SubscriberDocument = HydratedDocument<Subscriber>;

@Schema()
export class Subscriber {
  @Prop()
  name: string;

  @Prop()
  userId: number;
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);