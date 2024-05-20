import { Inject, Injectable } from '@nestjs/common';
import { ChatRepository } from '../chats.repository';
import { CreateThreadInput } from './dto/create-thread.input';
import { Thread } from './entities/thread.entity';
import { Types } from 'mongoose';
import { GetThreadsArgs } from './dto/get-threads.args';
import { TOKEN_PUB_SUB, TRIGGER_ON_THREAD_CREATED } from 'src/constants';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class ThreadsService {
  constructor(
    private readonly chatRepository: ChatRepository,
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
        $or: [{ creatorId: userId }, { memberIds: { $in: [userId] } }],
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
        $or: [{ creatorId: userId }, { memberIds: { $in: [userId] } }],
      })
    ).threads;
  }
}
