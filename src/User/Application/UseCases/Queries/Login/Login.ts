import { IQueryHandler } from '@nestjs/cqrs';
import Result from 'src/Common/Application/Result';
import { LoginQuery } from 'src/User/Application/UseCases/Queries/Login/LoginQuery';

export interface Login extends IQueryHandler<LoginQuery, string> {}
