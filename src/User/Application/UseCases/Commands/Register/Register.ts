import { ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from 'src/User/Application/UseCases/Commands/Register/RegisterCommand';

export interface Register extends ICommandHandler<RegisterCommand, void> {}
