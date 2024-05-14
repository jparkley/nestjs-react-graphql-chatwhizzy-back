import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/database/base.repository';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatRepository extends BaseRepository<Chat> {
  protected readonly logger = new Logger(ChatRepository.name);
  constructor(@InjectModel(Chat.name) chatModel: Model<Chat>) {
    super(chatModel);
  }
}
