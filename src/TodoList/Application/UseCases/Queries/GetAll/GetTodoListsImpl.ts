import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { TodoResponseMessages } from 'ResponseMessages/todo.response.messages';
import Result from 'src/Common/Application/Result';
import { NotFoundException } from 'src/Common/Domain/Exceptions/NotFoundException';
import NotValidInputException from 'src/Common/Domain/Exceptions/NotValidInput';
import { TodoListRepository } from 'src/TodoList/Application/Ports/TodoListRepository';
import { GetTodoLists } from 'src/TodoList/Application/UseCases/Queries/GetAll/GetTodoLists';
import { GetTodoListsQuery } from 'src/TodoList/Application/UseCases/Queries/GetAll/GetTodoListsQuery';
import { GetTodoList } from 'src/TodoList/Application/UseCases/Queries/GetOne/GetTodoList';
import { GetTodoListQuery } from 'src/TodoList/Application/UseCases/Queries/GetOne/GetTodoListQuery';
import { TodoListReadModel } from 'src/TodoList/Application/UseCases/Queries/TodoListReadModel';
import { TodoListId } from 'src/TodoList/Domain/TodoList/ValueObjects/TodoListId';
import { UserId } from 'src/TodoList/Domain/TodoList/ValueObjects/UseId';
import { TodoListMapper } from 'src/TodoList/Infrastructure/Output/Mappers/TodoListMapper';

@QueryHandler(GetTodoListsQuery)
export class GetTodoListsImpl implements GetTodoLists {
  public constructor(
    @Inject(TodoListRepository)
    private readonly todoListRepository: TodoListRepository,
  ) {}
  async execute(query: GetTodoListsQuery): Promise<Result<TodoListReadModel[]>> {
    const userId = UserId.fromValid(query.userId);
    const todoLists = await this.todoListRepository.loadAll(userId);

    const todoListReadModels: TodoListReadModel[] = [];

    for (const todoList of todoLists) {
      todoListReadModels.push(TodoListMapper.toReadModel(todoList));
    }

    return {
      ok: true,
      value: todoListReadModels,
    };
  }
}
