import { Inject, Injectable } from '@nestjs/common';
import { ChatRepository } from '../chats.repository';
import { CreateThreadInput } from './dto/create-thread.input';
import { Thread } from './entities/thread.entity';
import { Types } from 'mongoose';
import { GetThreadsArgs } from './dto/get-threads.args';
import { TOKEN_PUB_SUB, TRIGGER_ON_THREAD_CREATED } from 'src/constants';
import { PubSub } from 'graphql-subscriptions';
import { OnThreadCreatedArgs } from './dto/onThreadCreated.args';
import { ChatsService } from '../chats.service';

@Injectable()
export class ThreadsService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly chatsService: ChatsService,
    @Inject(TOKEN_PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async createThread({ content, chatId }: CreateThreadInput, userId: string) {
    const thread: Thread = {
      _id: new Types.ObjectId(),
      content,
      userId,
      createdAt: new Date(),
      chatId,
    };

    await this.chatRepository.findOneAndUpdate(
      {
        _id: chatId,
        ...this.chatsService.filterUserForChat(userId),
        // $or: [{ creatorId: userId }, { memberIds: { $in: [userId] } }],
      },
      {
        $push: {
          threads: thread,
        },
      },
    );
    this.pubSub.publish(TRIGGER_ON_THREAD_CREATED, {
      onThreadCreated: thread,
    });
    return thread;
  }

  async getThreads({ chatId }: GetThreadsArgs, userId: string) {
    return (
      await this.chatRepository.findOne({
        _id: chatId,
        ...this.chatsService.filterUserForChat(userId),
        // $or: [{ creatorId: userId }, { memberIds: { $in: [userId] } }],
      })
    ).threads;
  }

  async onThreadCreated({ chatId }: OnThreadCreatedArgs, userId: string) {
    return this.pubSub.asyncIterator(TRIGGER_ON_THREAD_CREATED);
  }
}
