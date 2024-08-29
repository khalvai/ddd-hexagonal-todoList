import { Inject } from '@nestjs/common';
import { HashService } from 'src/Common/Application/Output/HashService';
import Result from 'src/Common/Application/Result';
import { RegisterCommand } from 'src/User/Application/UseCases/Commands/Register/RegisterCommand';
import { UserRepository } from 'src/User/Application/Ports/UserRepository';
import { Register } from 'src/User/Application/UseCases/Commands/Register/Register';
import Email from 'src/User/Domain/Email';
import IP from 'src/User/Domain/IP';
import Name from 'src/User/Domain/Name';
import Password from 'src/User/Domain/Password';
import Notification from 'src/Common/Application/Notification';
import NotValidInputException from 'src/Common/Domain/Exceptions/NotValidInput';
import AlreadyExistsException from 'src/Common/Domain/Exceptions/AlreadyExistsException';
import User from 'src/User/Domain/User';
import { CommandHandler } from '@nestjs/cqrs';
import UserStatus from 'src/User/Domain/UserStatus';
import { CreateTodoListCommand } from 'src/TodoList/Application/UseCases/Commands/CreateTodoList/CrateTodoListCommand';
import { TodoListRepository } from 'src/TodoList/Application/Ports/TodoListRepository';
import { CreateTodoList } from 'src/TodoList/Application/UseCases/Commands/CreateTodoList/CreateTodoList';
import { UserId } from 'src/TodoList/Domain/TodoList/ValueObjects/UseId';
import { Title } from 'src/TodoList/Domain/TodoList/ValueObjects/Title';
import { TodoList } from 'src/TodoList/Domain/TodoList/TodoList';
import { TodoListId } from 'src/TodoList/Domain/TodoList/ValueObjects/TodoListId';

@CommandHandler(CreateTodoListCommand)
export class CreateTodoListImpl implements CreateTodoList {
  public constructor(
    @Inject(TodoListRepository)
    private readonly todoListRepository: TodoListRepository,
  ) {}
  async execute(command: CreateTodoListCommand): Promise<Result<TodoListId>> {
    const userId = UserId.fromValid(command.userId);

    const titleResult = Title.fromInput(command.title);

    if (!titleResult.ok) {
      return {
        ok: false,
        error: new NotValidInputException(titleResult.error.errors),
      };
    }

    const todoList = TodoList.create(titleResult.value, userId);

    if (!todoList.ok) {
      return {
        ok: false,
        error: todoList.error,
      };
    }

    await this.todoListRepository.save(todoList.value);

    return {
      ok: true,
      value: todoList.value.id,
    };
  }
}
