import { Module, forwardRef } from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { ThreadsResolver } from './threads.resolver';
import { ChatsModule } from '../chats.module';

@Module({
  imports: [forwardRef(() => ChatsModule)],
  providers: [ThreadsResolver, ThreadsService],
})
export class ThreadsModule {}
