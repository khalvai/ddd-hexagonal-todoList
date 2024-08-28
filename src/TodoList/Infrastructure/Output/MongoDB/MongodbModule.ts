import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoListDocument, TodoListSchema } from 'src/TodoList/Infrastructure/Output/MongoDB/TodoListSchema';

@Module({
  imports: [MongooseModule.forFeature([{ name: TodoListDocument.name, schema: TodoListSchema }])],
  exports: [MongooseModule.forFeature([{ name: TodoListDocument.name, schema: TodoListSchema }])],
})
export class TodoListMongoModule {}
