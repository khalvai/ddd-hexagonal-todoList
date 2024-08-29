import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { TodoResponseMessages } from 'ResponseMessages/todo.response.messages';
import Notification from 'src/Common/Application/Notification';
import Result from 'src/Common/Application/Result';
import { NotFoundException } from 'src/Common/Domain/Exceptions/NotFoundException';
import NotValidInputException from 'src/Common/Domain/Exceptions/NotValidInput';
import { TodoListRepository } from 'src/TodoList/Application/Ports/TodoListRepository';
import { RemoveItem } from 'src/TodoList/Application/UseCases/Commands/RemoveItem/RemoveItem';
import { RemoveItemCommand } from 'src/TodoList/Application/UseCases/Commands/RemoveItem/RemovItemCommand';
import { ItemId } from 'src/TodoList/Domain/Item/ItemId';
import { TodoListId } from 'src/TodoList/Domain/TodoList/ValueObjects/TodoListId';
import UserId from 'src/User/Domain/UserId';

@CommandHandler(RemoveItemCommand)
export class RemoveItemImpl implements RemoveItem {
  constructor(
    @Inject(TodoListRepository)
    private readonly todoListRepository: TodoListRepository,
  ) {}

  async execute(command: RemoveItemCommand): Promise<Result<void>> {
    const userId = UserId.fromValid(command.userId);

    const todoListIdResult = TodoListId.fromInput(command.todoListId);
    const itemIdResult = ItemId.fromInput(command.itemId);

    if (!todoListIdResult.ok || !itemIdResult.ok) {
      const notification = new Notification();
      notification.combineWithResult(todoListIdResult, itemIdResult);
      return {
        ok: false,
        error: new NotValidInputException(notification.errors),
      };
    }

    const todoList = await this.todoListRepository.load(todoListIdResult.value, userId);

    if (!todoList) {
      return {
        ok: false,
        error: new NotFoundException(TodoResponseMessages.TODO_LIST_NOT_FOUND),
      };
    }

    const removeResult = todoList.removeItem(itemIdResult.value);

    if (!removeResult.ok) {
      return {
        ok: false,
        error: removeResult.error,
      };
    }

    await this.todoListRepository.save(todoList);

    return {
      ok: true,
      value: undefined,
    };
  }
}
