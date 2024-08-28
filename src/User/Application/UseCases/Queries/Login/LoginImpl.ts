import Result from 'src/Common/Application/Result';
import { LoginQuery } from 'src/User/Application/UseCases/Queries/Login/LoginQuery';
import { Login } from 'src/User/Application/UseCases/Queries/Login/Login';
import { TokenService } from 'src/Common/Application/Output/TokenService';
import { Inject } from '@nestjs/common';
import { UserRepository } from 'src/User/Application/Ports/UserRepository';
import Email from 'src/User/Domain/Email';
import NotValidInputException from 'src/Common/Domain/Exceptions/NotValidInput';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserResponseMessages } from 'ResponseMessages/user.response.messages';
import { HashService } from 'src/Common/Application/Output/HashService';
import Password from 'src/User/Domain/Password';
import Notification from 'src/Common/Application/Notification';

@QueryHandler(LoginQuery)
export default class LoginImpl implements IQueryHandler<LoginQuery, Result<string>> {
  constructor(
    @Inject(TokenService) private readonly tokenService: TokenService,
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    @Inject(HashService) private readonly hashService: HashService,
  ) {}

  async execute(query: LoginQuery): Promise<Result<string>> {
    const resultEmail = Email.fromInput(query.email);

    const resultPassword = Password.fromInput(query.password);

    if (!resultEmail.ok || !resultPassword.ok) {
      const notification = new Notification();
      notification.combineWithResult(resultPassword, resultEmail);
      throw new NotValidInputException(notification.errors);
    }

    const user = await this.userRepository.loadByEmail(resultEmail.value);

    if (!user) {
      return {
        ok: false,
        error: new NotValidInputException([UserResponseMessages.INVALID_CREDENTIALS]),
      };
    }

    const equals = await this.hashService.compare(user.password.value, query.password);

    if (!equals) {
      return {
        ok: false,
        error: new NotValidInputException([UserResponseMessages.INVALID_CREDENTIALS]),
      };
    }

    const token = await this.tokenService.sign(JSON.stringify({ userId: user.id.value, name: user.name.value }), 24 * 60);

    return { ok: true, value: token };
  }
}
