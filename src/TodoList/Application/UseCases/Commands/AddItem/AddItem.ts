import { ICommandHandler } from '@nestjs/cqrs';
import Result from 'src/Common/Application/Result';
import { AddItemCommand } from 'src/TodoList/Application/UseCases/Commands/AddItem/AddItemCommand';

export interface AddItem extends ICommandHandler<AddItemCommand, void> {}
