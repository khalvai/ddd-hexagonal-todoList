import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TokenService } from 'src/Common/Application/Output/TokenService';
import JWTokenService from 'src/Common/Infrastructure/Output/JWTokenService';
import { TodoListRepository } from 'src/TodoList/Application/Ports/TodoListRepository';
import { AddItemImpl } from 'src/TodoList/Application/UseCases/Commands/AddItem/AddItemImpl';
import { CreateTodoListImpl } from 'src/TodoList/Application/UseCases/Commands/CreateTodoList/CreateTodoListImpl';
import { DeleteTodoListImpl } from 'src/TodoList/Application/UseCases/Commands/DeleteTodoList/DeleteTodoListImpl';
import { RemoveItemImpl } from 'src/TodoList/Application/UseCases/Commands/RemoveItem/RemoveItemImpl';
import { GetTodoListsImpl } from 'src/TodoList/Application/UseCases/Queries/GetAll/GetTodoListsImpl';
import { GetTodoListImpl } from 'src/TodoList/Application/UseCases/Queries/GetOne/GetTodoListImpl';
import { TodoListController } from 'src/TodoList/Infrastructure/Input/Http/TodoListController';
import { TodoListMongoModule } from 'src/TodoList/Infrastructure/Output/MongoDB/MongodbModule';
import { MongodbTodoListRepository } from 'src/TodoList/Infrastructure/Output/MongoDB/TodoListRepository';
import { MongoUserRepository } from 'src/User/Infrastructure/Output/MongoDB/UserRepository';

@Module({
  imports: [TodoListMongoModule, CqrsModule, ConfigModule],
  controllers: [TodoListController],
  providers: [
    { provide: TodoListRepository, useClass: MongodbTodoListRepository },
    {
      provide: TokenService,
      useClass: JWTokenService,
    },

    CreateTodoListImpl,
    DeleteTodoListImpl,
    AddItemImpl,
    RemoveItemImpl,
    GetTodoListImpl,
    GetTodoListsImpl,
  ],
})
export class TodoListModule {}
