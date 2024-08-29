import { ConfirmVerificationEmailCommand } from 'src/User/Application/UseCases/Commands/ConfirmVerificationEmail/ConfirmVerificationEmailCommand';
import { ICommandHandler } from '@nestjs/cqrs';

export interface ConfirmVerificationEmail extends ICommandHandler<ConfirmVerificationEmailCommand, void> {}
