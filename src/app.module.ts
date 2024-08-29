import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/User/UserModule';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoListModule } from 'src/TodoList/TodoListModule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    UserModule,
    TodoListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
