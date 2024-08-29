import { ICommandHandler } from '@nestjs/cqrs';
import Result from 'src/Common/Application/Result';
import { DeleteTodoListCommand } from 'src/TodoList/Application/UseCases/Commands/DeleteTodoList/DeleteTodoListCommand';

export interface DeleteTodoList extends ICommandHandler<DeleteTodoListCommand, Result<void>> {}
