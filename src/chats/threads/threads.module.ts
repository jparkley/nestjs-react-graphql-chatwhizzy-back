import { Module, forwardRef } from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { ThreadsResolver } from './threads.resolver';
import { ChatsModule } from '../chats.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [forwardRef(() => ChatsModule), UsersModule],
  providers: [ThreadsResolver, ThreadsService],
})
export class ThreadsModule {}
