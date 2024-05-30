import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/database/base.entity';
import { ThreadDocument } from '../threads/entities/thread.document';

// mongoose: @Schema, @Prop
@Schema({ versionKey: false })
export class ChatDocument extends BaseEntity {
  @Prop()
  userId: string;

  @Prop()
  chatName: string;

  @Prop([ThreadDocument])
  threads: ThreadDocument[];
}

export const ChatSchema = SchemaFactory.createForClass(ChatDocument);
