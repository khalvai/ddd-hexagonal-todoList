import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventDocument, EventSchema } from 'src/User/Infrastructure/Output/MongoDB/OutboxSchema';
@Schema({ timestamps: true })
export class UserDocument extends Document {
  @Prop({ required: true, index: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  concurrencySafeVersion: number;

  @Prop({ type: [EventSchema], default: [] })
  events: EventDocument[];

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
