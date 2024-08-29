import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventDocument, EventSchema } from 'src/User/Infrastructure/Output/MongoDB/OutboxSchema';

@Schema({ timestamps: true })
export class ItemDocument extends Document {
  @Prop({ required: true, index: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  priority: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  concurrencySafeVersion: number;

  createdAt: Date;
  updatedAt: Date;
}

export const ItemsSchema = SchemaFactory.createForClass(ItemDocument);

@Schema({ timestamps: true })
export class TodoListDocument extends Document {
  @Prop({ required: true, index: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  concurrencySafeVersion: number;

  @Prop({ type: [ItemsSchema], default: [] })
  items: ItemDocument[];

  createdAt: Date;
  updatedAt: Date;
}

export const TodoListSchema = SchemaFactory.createForClass(TodoListDocument);
