import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Body, Controller, Get, HttpException, HttpStatus, Inject, Ip, Param, Post, UseFilters } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';
import { Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { UserResponseMessages } from 'ResponseMessages/user.response.messages';
import Result from 'src/Common/Application/Result';
import { HttpExceptionFilter } from 'src/Common/Infrastructure/Output/HttpExceptionFilter';
import { ConfirmVerificationEmailCommand } from 'src/User/Application/UseCases/Commands/ConfirmVerificationEmail/ConfirmVerificationEmailCommand';
import { RegisterCommand } from 'src/User/Application/UseCases/Commands/Register/RegisterCommand';
import { LoginQuery } from 'src/User/Application/UseCases/Queries/Login/LoginQuery';
import { LoginDTO } from 'src/User/Infrastructure/Input/HTTP/Dto/LoginDTO';
import { RegisterDTO } from 'src/User/Infrastructure/Input/HTTP/Dto/ReginsterDTO';

@UseFilters(HttpExceptionFilter)
@ApiTags('Authentication')
@Controller('Auth')
export default class UserController {
  public constructor(
    private commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('/register')
  public async registerNewUser(@Body() registerCommand: RegisterDTO, @Ip() ip: string): Promise<{ message: string }> {
    const result = await this.commandBus.execute<RegisterCommand, Result<void>>(
      new RegisterCommand(registerCommand.email, registerCommand.password, registerCommand.confirmPassword, registerCommand.name, ip),
    );

    if (!result.ok) {
      throw result.error;
    }
    return {
      message: UserResponseMessages.VERIFICATION_TOKEN_SENT,
    };
  }

  @Get('/:token')
  public async confirmVerificationEmail(@Param('token') token: string): Promise<{ message: string }> {
    const result: Result<void> = await this.commandBus.execute<ConfirmVerificationEmailCommand, Result<void>>(
      new ConfirmVerificationEmailCommand(token),
    );

    if (!result.ok) {
      throw result.error;
    }

    return {
      message: UserResponseMessages.EMAIL_VERIFIED,
    };
  }
  @Post('/login')
  public async login(@Body() loginQuery: LoginDTO): Promise<{ token: string }> {
    const result: Result<string> = await this.queryBus.execute<LoginQuery, Result<string>>(
      new LoginQuery(loginQuery.email, loginQuery.password),
    );

    if (!result.ok) {
      throw result.error;
    }
    return { token: result.value };
  }

  // @Get("/VerifyEmailAddress/:emailVerificationToken")
  // public async verifyEmailAddress(@Param() emailVerificationToken: VerifyEmailAddressCommand): Promise<void>
  // {
  //     return this._verifyEmailAddressInputPort.handle(emailVerificationToken);
  // }
  // @Get("test")
  // public async test(): Promise<void>
  // {
  //     const token = await this._tokenService.signAndEncrypt(JSON.stringify({ name: "bahman" }), "AUTH", 5);

  //     console.log(token);
  // }
  //
}
