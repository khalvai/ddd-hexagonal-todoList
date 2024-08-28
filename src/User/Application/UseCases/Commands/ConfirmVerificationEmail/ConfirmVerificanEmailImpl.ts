import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { UserResponseMessages } from 'ResponseMessages/user.response.messages';
import { TokenService } from 'src/Common/Application/Output/TokenService';
import Result from 'src/Common/Application/Result';
import { ConfirmVerificationEmailCommand } from 'src/User/Application/UseCases/Commands/ConfirmVerificationEmail/ConfirmVerificationEmailCommand';
import { UserRepository } from 'src/User/Application/Ports/UserRepository';
import { ConfirmVerificationEmail } from 'src/User/Application/UseCases/Commands/ConfirmVerificationEmail/ConfirmVerificationEmail';
import UserId from 'src/User/Domain/UserId';

@CommandHandler(ConfirmVerificationEmailCommand)
export class ConfirmVerificationEmailImpl implements ConfirmVerificationEmail {
  constructor(
    @Inject(TokenService) private readonly tokenService: TokenService,
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async execute(command: ConfirmVerificationEmailCommand): Promise<Result<void>> {
    const verifyResult = await this.tokenService.verify(command.token);

    if (!verifyResult.ok) {
      return { ok: false, error: verifyResult.error };
    }

    let { userId, email, name, ip } = JSON.parse(verifyResult.value);

    const UserId2 = UserId.fromValid(userId);

    const user = await this.userRepository.load(UserId2);

    if (!user) {
      return {
        ok: false,
        error: new NotFoundException(UserResponseMessages.USER_NOT_AUTHENTICATED),
      };
    }

    user.confirmEmail();

    await this.userRepository.save(user);

    return { ok: true, value: undefined };
  }
}
