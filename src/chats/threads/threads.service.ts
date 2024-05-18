import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../chats.repository';
import { CreateThreadInput } from './dto/create-thread.input';
import { Thread } from './entities/thread.entity';
import { Types } from 'mongoose';
import { GetThreadsArgs } from './dto/get-threads.args';

@Injectable()
export class ThreadsService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async createThread({ content, chatId }: CreateThreadInput, userId: string) {
    const thread: Thread = {
      _id: new Types.ObjectId(),
      content,
      userId,
      createdAt: new Date(),
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
