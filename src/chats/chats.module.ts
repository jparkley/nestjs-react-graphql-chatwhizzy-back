import { Module, forwardRef } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { DatabaseModule } from 'src/common/database/database.module';
import { Chat } from './entities/chat.entity';
import { ChatSchema } from './entities/chat.document';
import { ChatRepository } from './chats.repository';
import { ThreadsModule } from './threads/threads.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
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
