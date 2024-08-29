import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { TodoListRepository } from 'src/TodoList/Application/Ports/TodoListRepository';
import { UpdateItem } from 'src/TodoList/Application/UseCases/Commands/UpdateItem/UpdateItem';
import { UpdateItemCommand } from 'src/TodoList/Application/UseCases/Commands/UpdateItem/UpdateItemCommand';
import { Description } from 'src/TodoList/Domain/Item/Description';
import { Priority } from 'src/TodoList/Domain/Item/Priority';
import { Title } from 'src/TodoList/Domain/TodoList/ValueObjects/Title';
import Notification from 'src/Common/Application/Notification';
import { TodoListId } from 'src/TodoList/Domain/TodoList/ValueObjects/TodoListId';
import { ItemId } from 'src/TodoList/Domain/Item/ItemId';
import NotValidInputException from 'src/Common/Domain/Exceptions/NotValidInput';
import { UserId } from 'src/TodoList/Domain/TodoList/ValueObjects/UseId';
import { NotFoundException } from 'src/Common/Domain/Exceptions/NotFoundException';
import { TodoResponseMessages } from 'ResponseMessages/todo.response.messages';

@CommandHandler(UpdateItemCommand)
export class UpdateItemImpl implements UpdateItem {
  constructor(
    @Inject(TodoListRepository)
    private readonly todoListRepository: TodoListRepository,
  ) {}
  async execute(command: UpdateItemCommand): Promise<void> {
    const todoListIdResult = TodoListId.fromInput(command.todoListId);
    const itemIdResult = ItemId.fromInput(command.itemId);
    const userId = UserId.fromValid(command.userId);
    const fields = this.validate(command);

    if (!todoListIdResult.ok || !itemIdResult.ok || fields.notification.hasErrors()) {
      fields.notification.combineWithResult(todoListIdResult, itemIdResult);
      throw new NotValidInputException(fields.notification.errors);
    }

    const todoList = await this.todoListRepository.load(todoListIdResult.value, userId);

    if (!todoList) {
      throw new NotFoundException(TodoResponseMessages.TODO_LIST_NOT_FOUND);
    }

    todoList.updateItem({ description: fields.description, title: fields.title, priority: fields.priority, itemId: itemIdResult.value });

    await this.todoListRepository.save(todoList);
  }
  private validate(command: UpdateItemCommand): {
    title?: Title;
    description?: Description;
    priority?: Priority;
    notification: Notification;
  } {
    const notification = new Notification();

    const title = command.payload.title ? Notification.combineValidation(Title.fromInput(command.payload.title), notification) : undefined;

    const description = command.payload.description
      ? Notification.combineValidation(Description.fromInput(command.payload.description), notification)
      : undefined;

    const priority = command.payload.priority
      ? Notification.combineValidation(Priority.fromInput(command.payload.priority), notification)
      : undefined;

    return { title, description, priority, notification };
  }
}
