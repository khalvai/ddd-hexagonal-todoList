import { IQueryHandler } from '@nestjs/cqrs';
import Result from 'src/Common/Application/Result';
import { GetTodoListQuery } from 'src/TodoList/Application/UseCases/Queries/GetOne/GetTodoListQuery';
import { TodoListReadModel } from 'src/TodoList/Application/UseCases/Queries/TodoListReadModel';

export interface GetTodoList extends IQueryHandler<GetTodoListQuery, Result<TodoListReadModel>> {}
