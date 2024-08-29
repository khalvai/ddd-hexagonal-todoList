import { ICommandHandler } from '@nestjs/cqrs';
import Result from 'src/Common/Application/Result';
import { RemoveItemCommand } from 'src/TodoList/Application/UseCases/Commands/RemoveItem/RemovItemCommand';

export interface RemoveItem extends ICommandHandler<RemoveItemCommand, Result<void>> {}
