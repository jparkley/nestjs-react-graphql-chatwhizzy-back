import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class GqlGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().req;
  }
}
