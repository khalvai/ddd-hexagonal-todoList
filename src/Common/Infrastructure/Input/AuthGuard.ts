import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { TokenService } from 'src/Common/Application/Output/TokenService';

@ApiBearerAuth()
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(TokenService) private readonly tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      return false;
    }
    const verifyResult = await this.tokenService.verify(token);

    if (!verifyResult.ok) {
      throw verifyResult.error;
    }

    request['userId'] = JSON.parse(verifyResult.value)['userId'];

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
