import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { TodoResponseMessages } from 'ResponseMessages/todo.response.messages';
import Result from 'src/Common/Application/Result';
import { NotFoundException } from 'src/Common/Domain/Exceptions/NotFoundException';
import NotValidInputException from 'src/Common/Domain/Exceptions/NotValidInput';
import { TodoListRepository } from 'src/TodoList/Application/Ports/TodoListRepository';
import { GetTodoList } from 'src/TodoList/Application/UseCases/Queries/GetOne/GetTodoList';
import { GetTodoListQuery } from 'src/TodoList/Application/UseCases/Queries/GetOne/GetTodoListQuery';
import { TodoListReadModel } from 'src/TodoList/Application/UseCases/Queries/TodoListReadModel';
import { TodoListId } from 'src/TodoList/Domain/TodoList/ValueObjects/TodoListId';
import { UserId } from 'src/TodoList/Domain/TodoList/ValueObjects/UseId';
import { TodoListMapper } from 'src/TodoList/Infrastructure/Output/Mappers/TodoListMapper';

@QueryHandler(GetTodoListQuery)
export class GetTodoListImpl implements GetTodoList {
  public constructor(
    @Inject(TodoListRepository)
    private readonly todoListRepository: TodoListRepository,
  ) {}

  async execute(query: GetTodoListQuery): Promise<Result<TodoListReadModel>> {
    const userId = UserId.fromValid(query.userId);

    const todoListId = TodoListId.fromInput(query.todoListId);
    if (!todoListId.ok) {
      return {
        ok: false,
        error: new NotValidInputException(todoListId.error.errors),
      };
    }

    const todoList = await this.todoListRepository.load(todoListId.value, userId);

    if (!todoList) {
      return {
        ok: false,
        error: new NotFoundException(TodoResponseMessages.TODO_LIST_NOT_FOUND),
      };
    }

    const readModel = TodoListMapper.toReadModel(todoList);

    return { ok: true, value: readModel };
  }
}
