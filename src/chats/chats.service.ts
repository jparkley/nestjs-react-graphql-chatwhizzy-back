import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatRepository } from './chats.repository';

@Injectable()
export class ChatsService {
  constructor(private readonly chatRepository: ChatRepository) {}
  async create(createChatInput: CreateChatInput, userId: string) {
    return this.chatRepository.create({
      ...createChatInput,
      creatorId: userId,
      memberIds: createChatInput.memberIds || [],
      threads: [],
    });
  }

  async findAll() {
    return await this.chatRepository.find({});
  }

  async findOne(_id: string) {
    return await this.chatRepository.findOne({ _id });
  }

  update(id: number, updateChatInput: UpdateChatInput) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
