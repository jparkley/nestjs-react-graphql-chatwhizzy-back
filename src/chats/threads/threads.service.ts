import { Inject, Injectable } from '@nestjs/common';
import { ChatRepository } from '../chats.repository';
import { CreateThreadInput } from './dto/create-thread.input';
import { Thread } from './entities/thread.entity';
import { Types } from 'mongoose';
import { GetThreadsArgs } from './dto/get-threads.args';
import { TOKEN_PUB_SUB, TRIGGER_ON_THREAD_CREATED } from 'src/constants';
import { PubSub } from 'graphql-subscriptions';
import { OnThreadCreatedArgs } from './dto/onThreadCreated.args';
import { ThreadDocument } from './entities/thread.document';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ThreadsService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly usersService: UsersService,
    @Inject(TOKEN_PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async createThread({ content, chatId }: CreateThreadInput, userId: string) {
    const threadDocument: ThreadDocument = {
      _id: new Types.ObjectId(),
      content,
      userId: new Types.ObjectId(userId),
      createdAt: new Date(),
    };

    await this.chatRepository.findOneAndUpdate(
      {
        _id: chatId,
      },
      {
        $push: {
          threads: threadDocument,
        },
      },
    );

    // create graphql thread entity to send to websocket
    const thread: Thread = {
      ...threadDocument,
      chatId,
      user: await this.usersService.findOne(userId),
    };

    await this.pubSub.publish(TRIGGER_ON_THREAD_CREATED, {
      onThreadCreated: thread,
    });
    return thread;
  }

  async getThreads({ chatId }: GetThreadsArgs) {
    const threads = await this.chatRepository.model.aggregate([
      { $match: { _id: new Types.ObjectId(chatId) } },
      { $unwind: '$threads' },
      { $replaceRoot: { newRoot: '$threads' } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $unset: 'userId ' },
      { $set: { chatId } },
    ]);

    for (const thread of threads) {
      thread.user = this.usersService.transferToEntity(thread.user);
    }
    return threads;
    // return (
    //   await this.chatRepository.findOne({
    //     _id: chatId,
    //   })
    // ).threads;
  }

  async onThreadCreated() {
    return this.pubSub.asyncIterator(TRIGGER_ON_THREAD_CREATED);
  }
}
