import { IQueryHandler } from '@nestjs/cqrs';
import Result from 'src/Common/Application/Result';
import { GetTodoListsQuery } from 'src/TodoList/Application/UseCases/Queries/GetAll/GetTodoListsQuery';
import { TodoListReadModel } from 'src/TodoList/Application/UseCases/Queries/TodoListReadModel';

export interface GetTodoLists extends IQueryHandler<GetTodoListsQuery, TodoListReadModel[]> {}
