import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class OutboxDocument extends Document {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  payload: string;

  @Prop({ required: true })
  dispatched: boolean;

  @Prop({ required: true })
  occurredOn: Date;

  @Prop()
  eventType: string;
}

export const OutboxSchema = SchemaFactory.createForClass(OutboxDocument);
