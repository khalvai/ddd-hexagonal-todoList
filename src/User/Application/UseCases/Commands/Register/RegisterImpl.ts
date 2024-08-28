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
import UserId from 'src/User/Domain/UserId';
import User from 'src/User/Domain/User';
import { CommandHandler } from '@nestjs/cqrs';
import UserStatus from 'src/User/Domain/UserStatus';

@CommandHandler(RegisterCommand)
export class RegisterUseCaseImpl implements Register {
  public constructor(
    @Inject(HashService)
    private readonly hashService: HashService,

    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}
  async execute(command: RegisterCommand): Promise<Result<void>> {
    const emailResult = Email.fromInput(command.email);
    const passwordResult = Password.fromInput(command.password);
    const confirmPasswordResult = Password.fromInput(command.confirmPassword);
    const nameResult = Name.fromInput(command.name);
    const ipResult = IP.fromInput(command.ip);

    if (!emailResult.ok || !passwordResult.ok || !confirmPasswordResult.ok || !nameResult.ok || !ipResult.ok) {
      const notification = new Notification();
      notification.combineWithResult(emailResult, passwordResult, confirmPasswordResult, nameResult, ipResult);
      return { ok: false, error: new NotValidInputException(notification.errors) };
    }

    const existedUser = await this.userRepository.loadByEmail(emailResult.value);

    if (existedUser && existedUser.status !== UserStatus.PENDING_EMAIL_VERIFICATION) {
      return {
        ok: false,
        error: new AlreadyExistsException('USER_ALREADY_EXISTS'),
      };
    }

    const hashedPassword = await this.hashService.createHash(passwordResult.value.value);

    const uuid = UserId.create();

    const user: User = new User();

    user.register(uuid, nameResult.value, emailResult.value, Password.createFromHashed(hashedPassword), ipResult.value);

    await this.userRepository.save(user);

    return { ok: true, value: undefined };
  }
}
