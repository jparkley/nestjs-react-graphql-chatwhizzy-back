import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/database/base.repository';
import { Chat } from './entities/chat.entity';
import { ChatDocument } from './entities/chat.document';

@Injectable()
export class ChatRepository extends BaseRepository<ChatDocument> {
  protected readonly logger = new Logger(ChatRepository.name);
  constructor(@InjectModel(Chat.name) chatModel: Model<ChatDocument>) {
    super(chatModel);
  }
}
