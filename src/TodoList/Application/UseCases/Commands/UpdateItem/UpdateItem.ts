import { ICommandHandler } from '@nestjs/cqrs';
import Result from 'src/Common/Application/Result';
import { UpdateItemCommand } from 'src/TodoList/Application/UseCases/Commands/UpdateItem/UpdateItemCommand';

export interface UpdateItem extends ICommandHandler<UpdateItemCommand, void> {}
