import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Check if the request has a token (either in cookies or headers)
    const hasToken =
      request?.cookies?.access_token || request?.headers?.authorization;

    if (hasToken) {
      // If a token is present, proceed to validate using JwtStrategy
      return super.canActivate(context);
    }

    // If no token is present, allow access without validation
    return true;
  }
}
