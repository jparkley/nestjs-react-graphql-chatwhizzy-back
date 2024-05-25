import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseEntity } from 'src/common/database/base.entity';

@Schema()
export class ThreadDocument extends BaseEntity {
  @Prop()
  content: string;

  @Prop()
  userId: Types.ObjectId;

  @Prop()
  createdAt: Date;
}
