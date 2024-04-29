import { AuthGuard } from '@nestjs/passport';

// guard will apply the given strategy to routes ('local')
export class LocalGuard extends AuthGuard('local') {}
