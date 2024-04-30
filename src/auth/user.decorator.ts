import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  // Return current user of the request
  // that passsport automatically populated
  (_data: unknown, context: ExecutionContext): User => {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest().user;
    } else if (context.getType<GqlContextType>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req.user;
    }
  },
);
