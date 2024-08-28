import { ICommandHandler } from '@nestjs/cqrs';
import Result from 'src/Common/Application/Result';
import { SendVerificationEmailCommand } from 'src/User/Application/UseCases/Commands/SendVerificationEmail/SendVerificationEmailCommand';

export interface SendVerificationEmail extends ICommandHandler<SendVerificationEmailCommand, Result<void>> {}
