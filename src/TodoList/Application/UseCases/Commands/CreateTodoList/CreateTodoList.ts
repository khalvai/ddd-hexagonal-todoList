import { ICommandHandler } from '@nestjs/cqrs';
import Result from 'src/Common/Application/Result';
import { CreateTodoListCommand } from 'src/TodoList/Application/UseCases/Commands/CreateTodoList/CrateTodoListCommand';
import { TodoListId } from 'src/TodoList/Domain/TodoList/ValueObjects/TodoListId';

export interface CreateTodoList extends ICommandHandler<CreateTodoListCommand, TodoListId> {}
