import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { TodoListRepository } from 'src/TodoList/Application/Ports/TodoListRepository';
import { GetTodoLists } from 'src/TodoList/Application/UseCases/Queries/GetAll/GetTodoLists';
import { GetTodoListsQuery } from 'src/TodoList/Application/UseCases/Queries/GetAll/GetTodoListsQuery';
import { TodoListReadModel } from 'src/TodoList/Application/UseCases/Queries/TodoListReadModel';
import { UserId } from 'src/TodoList/Domain/TodoList/ValueObjects/UseId';
import { TodoListMapper } from 'src/TodoList/Infrastructure/Output/Mappers/TodoListMapper';

@QueryHandler(GetTodoListsQuery)
export class GetTodoListsImpl implements GetTodoLists {
  public constructor(
    @Inject(TodoListRepository)
    private readonly todoListRepository: TodoListRepository,
  ) {}
  async execute(query: GetTodoListsQuery): Promise<TodoListReadModel[]> {
    const userId = UserId.fromValid(query.userId);
    const todoLists = await this.todoListRepository.loadAll(userId);

    const todoListReadModels: TodoListReadModel[] = [];

    for (const todoList of todoLists) {
      todoListReadModels.push(TodoListMapper.toReadModel(todoList));
    }

    return todoListReadModels;
  }
}
