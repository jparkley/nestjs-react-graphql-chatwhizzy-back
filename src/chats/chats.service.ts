import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatRepository } from './chats.repository';
import { PipelineStage, Types } from 'mongoose';

@Injectable()
export class ChatsService {
  constructor(private readonly chatRepository: ChatRepository) {}
  async create(createChatInput: CreateChatInput, userId: string) {
    return this.chatRepository.create({
      ...createChatInput,
      creatorId: userId,
      threads: [],
    });
  }

  async findMany(prePipelineStages: PipelineStage[] = []) {
    const chats = await this.chatRepository.model.aggregate([
      ...prePipelineStages,
      { $set: { latestThread: { $arrayElemAt: ['$threads', -1] } } },
      { $unset: 'threads' },
      {
        $lookup: {
          from: 'users',
          localField: 'latestThread.userId',
          foreignField: '_id',
          as: 'latestThread.user',
        },
      },
    ]);
    chats.forEach((chat) => {
      if (!chat.latestThread?._id) {
        delete chat.latestThread;
        return;
      }
      chat.latestThread.user = chat.latestThread.user[0];
      delete chat.latestThread.userId;
      chat.latestThread.chatId = chat._id;
    });
    return chats;
    // return await this.chatRepository.find({});
  }

  async findOne(_id: string) {
    const chats = await this.findMany([
      { $match: { chatId: new Types.ObjectId(_id) } },
    ]);
    if (!chats[0]) {
      throw new NotFoundException(`No chat was found with ID ${_id}`);
    }
    return chats[0];
    // return await this.chatRepository.findOne({ _id });
  }

  update(id: number, updateChatInput: UpdateChatInput) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  filterUserForChat(userId: string) {
    return {
      $or: [
        { creatorId: userId },
        { memberIds: { $in: [userId] } },
        { isPrivate: false },
      ],
    };
  }
}
