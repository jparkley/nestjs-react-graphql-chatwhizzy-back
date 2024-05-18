import { Module, forwardRef } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { DatabaseModule } from 'src/common/database/database.module';
import { Chat, ChatSchema } from './entities/chat.entity';
import { ChatRepository } from './chats.repository';
import { ThreadsModule } from './threads/threads.module';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: Chat.name,
        schema: ChatSchema,
      },
    ]),
    forwardRef(() => ThreadsModule),
  ],
  providers: [ChatsResolver, ChatsService, ChatRepository],
  exports: [ChatRepository],
})
export class ChatsModule {}
