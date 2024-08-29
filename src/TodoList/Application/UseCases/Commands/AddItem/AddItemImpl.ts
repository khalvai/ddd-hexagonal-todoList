import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { TodoResponseMessages } from 'ResponseMessages/todo.response.messages';
import Notification from 'src/Common/Application/Notification';
import Result from 'src/Common/Application/Result';
import { NotFoundException } from 'src/Common/Domain/Exceptions/NotFoundException';
import NotValidInputException from 'src/Common/Domain/Exceptions/NotValidInput';
import { TodoListRepository } from 'src/TodoList/Application/Ports/TodoListRepository';
import { AddItem } from 'src/TodoList/Application/UseCases/Commands/AddItem/AddItem';
import { AddItemCommand } from 'src/TodoList/Application/UseCases/Commands/AddItem/AddItemCommand';
import { Description } from 'src/TodoList/Domain/Item/Description';
import { Priority } from 'src/TodoList/Domain/Item/Priority';
import { Title } from 'src/TodoList/Domain/TodoList/ValueObjects/Title';
import { TodoListId } from 'src/TodoList/Domain/TodoList/ValueObjects/TodoListId';
import { UserId } from 'src/TodoList/Domain/TodoList/ValueObjects/UseId';

@CommandHandler(AddItemCommand)
export class AddItemImpl implements AddItem {
  @Inject(TodoListRepository)
  private readonly todoListRepository: TodoListRepository;

  async execute(command: AddItemCommand): Promise<Result<void>> {
    const todoListIdResult = TodoListId.fromInput(command.todoListId);
    const titleResult = Title.fromInput(command.title);
    const descriptionResult = Description.fromInput(command.description);
    const priorityResult = Priority.fromInput(command.priority);
    const userId = UserId.fromValid(command.userId);

    if (!todoListIdResult.ok || !titleResult.ok || !descriptionResult.ok || !priorityResult.ok) {
      const notification = new Notification();
      notification.combineWithResult(todoListIdResult, titleResult, descriptionResult, priorityResult);
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

    todoList.addItem(titleResult.value, descriptionResult.value, priorityResult.value);

    await this.todoListRepository.save(todoList);

    return {
      ok: true,
      value: undefined,
    };
  }
}
