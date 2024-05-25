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
    return this.chatRepository.model.aggregate([
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
    // return (
    //   await this.chatRepository.findOne({
    //     _id: chatId,
    //   })
    // ).threads;
  }

  async onThreadCreated({ chatId }: OnThreadCreatedArgs) {
    // verify if user has access to chat
    await this.chatRepository.findOne({
      _id: chatId,
    });
    return this.pubSub.asyncIterator(TRIGGER_ON_THREAD_CREATED);
  }
}
