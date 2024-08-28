import { ICommand, ICommandHandler } from '@nestjs/cqrs';
import Result from 'src/Common/Application/Result';
import { ConfirmVerificationEmailCommand } from 'src/User/Application/UseCases/Commands/ConfirmVerificationEmail/ConfirmVerificationEmailCommand';

export interface ConfirmVerificationEmail extends ICommandHandler<ConfirmVerificationEmailCommand, Result<void>> {}
