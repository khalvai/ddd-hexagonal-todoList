import { Module } from '@nestjs/common';
import { HashService } from 'src/Common/Application/Output/HashService';
import { TokenService } from 'src/Common/Application/Output/TokenService';
import { Argon2HashService } from 'src/Common/Infrastructure/Output/Argon2HashService';
import JWTokenService from 'src/Common/Infrastructure/Output/JWTokenService';
import { NestjsEventEmitterModule } from 'src/Common/Infrastructure/Output/NestjsEventEmitterModule';
import { ConfirmVerificationEmailImpl } from 'src/User/Application/Ports/Input/ConfirmVerificanEmailImpl';
import { RegisterUseCaseImpl } from 'src/User/Application/Ports/Input/RegisterImpl';
import { SendVerificationEmailImp } from 'src/User/Application/Ports/Input/SendVerificationEmailImpl';
import { EmailServiceProvider } from 'src/User/Application/Ports/Output/EmailServiceProvider';
import { OutboxRepository } from 'src/User/Application/Ports/Output/OutboxRepository';
import { Template } from 'src/User/Application/Ports/Output/Template';
import { UserRepository } from 'src/User/Application/Ports/Output/UserRepository';
import { Consumer } from 'src/User/Infrastructure/Input/Consumer';
import { LiaraEmailServiceProvider } from 'src/User/Infrastructure/Output/LiaraEmailServiceProvider';
import { OutboxMapper } from 'src/User/Infrastructure/Output/Mapper/OutboxMapper';
import UserMapper from 'src/User/Infrastructure/Output/Mapper/UserMapper';
import { OutboxDispatcher } from 'src/User/Infrastructure/Output/OutboxDispatcher';
import { EJSTemplate } from 'src/User/Infrastructure/Output/Template/EjsTemplate';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import LoginImpl from 'src/User/Application/Ports/Input/LoginImpl';
import UserController from 'src/User/Infrastructure/Input/HTTP/UserController';
import { UserMongoModule } from 'src/User/Infrastructure/Output/MongoDB/MongodbModule';
import { MongoUserRepository } from 'src/User/Infrastructure/Output/MongoDB/UserRepository';
import { MongoOutboxRepository } from 'src/User/Infrastructure/Output/MongoDB/OutboxRepository';

@Module({
  imports: [UserMongoModule, NestjsEventEmitterModule, CqrsModule, ConfigModule],
  controllers: [UserController, Consumer],
  providers: [
    {
      provide: UserRepository,
      useClass: MongoUserRepository,
    },

    {
      provide: OutboxRepository,
      useClass: MongoOutboxRepository,
    },
    {
      provide: TokenService,
      useClass: JWTokenService,
    },

    {
      provide: HashService,
      useClass: Argon2HashService,
    },
    {
      provide: Template,
      useClass: EJSTemplate,
    },
    {
      provide: EmailServiceProvider,
      useClass: LiaraEmailServiceProvider,
    },
    RegisterUseCaseImpl,
    SendVerificationEmailImp,
    ConfirmVerificationEmailImpl,
    LoginImpl,
    OutboxMapper,
    UserMapper,
    OutboxDispatcher,
  ],
})
export class UserModule {}
