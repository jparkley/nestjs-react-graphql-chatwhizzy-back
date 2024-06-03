import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/database/base.entity';

@Schema({ versionKey: false }) // don't keep track of version change
export class UserDocument extends BaseEntity {
  @Prop({ index: true, unique: true, trim: true })
  email: string;

  @Prop()
  username: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
