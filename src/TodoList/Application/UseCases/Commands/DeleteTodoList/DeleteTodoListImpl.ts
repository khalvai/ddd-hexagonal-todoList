import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { TodoResponseMessages } from 'ResponseMessages/todo.response.messages';
import Result from 'src/Common/Application/Result';
import { NotFoundException } from 'src/Common/Domain/Exceptions/NotFoundException';
import NotValidInputException from 'src/Common/Domain/Exceptions/NotValidInput';
import { TodoListRepository } from 'src/TodoList/Application/Ports/TodoListRepository';
import { DeleteTodoList } from 'src/TodoList/Application/UseCases/Commands/DeleteTodoList/DeleteTodoList';
import { DeleteTodoListCommand } from 'src/TodoList/Application/UseCases/Commands/DeleteTodoList/DeleteTodoListCommand';
import { TodoListId } from 'src/TodoList/Domain/TodoList/ValueObjects/TodoListId';
import { UserId } from 'src/TodoList/Domain/TodoList/ValueObjects/UseId';

@CommandHandler(DeleteTodoListCommand)
export class DeleteTodoListImpl implements DeleteTodoList {
  public constructor(
    @Inject(TodoListRepository)
    private readonly todoListRepository: TodoListRepository,
  ) {}

  async execute(command: DeleteTodoListCommand): Promise<Result<void>> {
    const userId = UserId.fromValid(command.userId);
    const todoListIdResult = TodoListId.fromInput(command.todoListId);

    if (!todoListIdResult.ok) {
      return {
        ok: false,
        error: new NotValidInputException(todoListIdResult.error.errors),
      };
    }

    const todoList = await this.todoListRepository.load(todoListIdResult.value, userId);

    if (!todoList) {
      return {
        ok: false,
        error: new NotFoundException(TodoResponseMessages.TODO_LIST_NOT_FOUND),
      };
    }

    todoList.delete();

    await this.todoListRepository.save(todoList);

    return {
      ok: true,
      value: undefined,
    };
  }
}
