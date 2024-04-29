import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  // Return current user of the request
  // that passsport automatically populated
  (_data: unknown, context: ExecutionContext): User => {
    return context.switchToHttp().getRequest().user;
  },
);
